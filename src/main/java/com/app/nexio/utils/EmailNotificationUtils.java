package com.app.nexio.utils;

public class EmailNotificationUtils {

    public static final String EMAIL = "EMAIL";

    public static final String CREATED_ACCOUNT_SUBJECT = "Successfully created account";
    public static final String ITEM_POSTED_SUBJECT = "Item Successfully Posted";

    private static final String REGISTRATION_BODY_TEMPLATE = "Thank You for Joining Us!\n" +
            "We are thrilled to welcome you to our platform! Your registration was successful, and we're excited to have you on board.\n" +
            "Feel free to customize it further to match your platform's tone and style!";

    private static final String ITEM_POSTED_BODY_TEMPLATE = "Hello!\n\n" +
            "Your item \"%s\" has been successfully posted on our platform.\n\n" +
            "Thank you for using our service!\n\n" +
            "Best regards,\n" +
            "The Nexio Team";

    public static String getRegistrationBody() {
        return REGISTRATION_BODY_TEMPLATE;
    }

    public static String getItemPostedBody(String itemName) {
        return String.format(ITEM_POSTED_BODY_TEMPLATE, itemName);
    }
}

