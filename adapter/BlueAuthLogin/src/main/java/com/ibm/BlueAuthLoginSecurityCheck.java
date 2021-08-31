/**
 * Copyright 2015, 2018 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.ibm;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.util.*;

import com.ibm.mfp.server.security.external.checks.SecurityCheckConfiguration;
import org.apache.http.*;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import com.auth0.jwt.*;
import java.util.Base64;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.IOException;
import java.net.URISyntaxException;

import org.json.JSONObject;
import org.xml.sax.SAXException;

public class BlueAuthLoginSecurityCheck extends UserAuthenticationSecurityCheck {
    private String userId;
    private String errorMsg;
    private boolean rememberMe = false;
    private String access_token = null;
    private transient CloseableHttpClient client;
    private transient HttpResponse response;
    private transient HttpEntity httpEntity;

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new BlueAuthLoginConfiguration(properties);
    }

    @Override
    protected BlueAuthLoginConfiguration getConfiguration() {
        return (BlueAuthLoginConfiguration) super.getConfiguration();
    }


    @Override
    protected AuthenticatedUser createUser() {

        Map<String, Object> attrMap = new HashMap<String,Object>();
        attrMap.put("access_token",access_token);

        return new AuthenticatedUser(userId, userId, this.getName(),attrMap);
    }

    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        if(credentials!=null && credentials.containsKey("username") && credentials.containsKey("password") && credentials.containsKey("scope")){

            String username = credentials.get("username").toString();
            String password = credentials.get("password").toString();
            String scope = credentials.get("scope").toString();
            if(username!="" && password!="" && scope!="") {

                //Optional RememberMe
                if(credentials.containsKey("rememberMe") ){
                    rememberMe = Boolean.valueOf(credentials.get("rememberMe").toString());
                }
                errorMsg = null;

                try{
                    String response = validCredentialswithBlueAuthServer(username,password, scope);

                    if(response!=null){

                        org.json.JSONObject jsonObj = new org.json.JSONObject(response);
                        if(jsonObj.has("access_token")){
                            access_token = jsonObj.get("access_token").toString();
                            userId = getUsernamefromToken(access_token);
                        }else if(jsonObj.has("response")){
                            errorMsg =jsonObj.getJSONObject("response").get("error_description").toString();
                            return false;
                        } else {
                            errorMsg = "Internal Server Error";
                            return false;
                        }
                    }
                }catch(Exception e){
                    System.out.println(e.toString());
                    errorMsg = e.getLocalizedMessage();
                    return false;
                }
                return true;
            }
            else {
                errorMsg = "Wrong Credentials";
            }
        }
        else{
            errorMsg = "Credentials not set properly";
        }
        return false;
    }

    private String getUsernamefromToken(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            return  jwt.getClaim("user_name").asString();
        } catch (JWTDecodeException exception){
            //Invalid token
        }
        return null;
    }

    @Override
    protected Map<String, Object> createChallenge() {
        Map<String, Object> challenge = new HashMap<String, Object>();
        challenge.put("errorMsg",errorMsg);
        challenge.put("remainingAttempts",getRemainingAttempts());
        return challenge;
    }

    @Override
    protected boolean rememberCreatedUser() {
        return rememberMe;
    }

    public String validCredentialswithBlueAuthServer(String username, String password, String scope) throws IOException, IllegalStateException, SAXException, URISyntaxException {

        HttpPost request = new HttpPost(getConfiguration().authURL);
        String auth = getConfiguration().clientID + ":" + getConfiguration().clientSecret;

        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("username", username));
        params.add(new BasicNameValuePair("password", password));
        params.add(new BasicNameValuePair("scope", scope));
        params.add(new BasicNameValuePair("grant_type", "password"));

        request.setEntity(new UrlEncodedFormEntity(params));
        request.addHeader(HttpHeaders.AUTHORIZATION, "Basic " + new String(Base64.getEncoder().encode(auth.getBytes())));
        request.setHeader("Content-Type", "application/x-www-form-urlencoded");

        return execute(request);
    }

    public String execute(HttpUriRequest req) throws IOException, IllegalStateException {
        client = HttpClientBuilder.create().build();
        response = client.execute(req);
        httpEntity = response.getEntity();
        return httpEntity != null ? EntityUtils.toString(httpEntity) : null;

    }

}
