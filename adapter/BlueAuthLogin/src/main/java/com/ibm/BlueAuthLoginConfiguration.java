package com.ibm;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheckConfig;

import java.util.Properties;


public class BlueAuthLoginConfiguration extends UserAuthenticationSecurityCheckConfig {

    public String authURL;
    public String clientID;
    public String clientSecret;
    private static final String TOKEN_ENDPOINT_PROPERTY = "TokenEndpointURL";
    private static final String CLIENT_ID_PROPERTY = "ClientID";
    private static final String CLIENT_SECRET_PROPERTY = "ClientSecret";

    public BlueAuthLoginConfiguration(Properties properties) {
        //Make sure to load the parent properties
        super(properties);

        //Load the api key property
        authURL = getStringProperty(TOKEN_ENDPOINT_PROPERTY, properties, null);
        clientID = getStringProperty(CLIENT_ID_PROPERTY, properties, null);
        clientSecret = getStringProperty(CLIENT_SECRET_PROPERTY, properties, null);
    }

}
