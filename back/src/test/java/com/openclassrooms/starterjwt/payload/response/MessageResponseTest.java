package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MessageResponseTest {

    @Test
    public void testMessageResponseConstructorAndGetter() {
        String expectedMessage = "This is a test message.";

        MessageResponse messageResponse = new MessageResponse(expectedMessage);

        assertEquals(expectedMessage, messageResponse.getMessage(), "The message should be correctly set by the constructor.");
    }

    @Test
    public void testMessageResponseSetter() {
        MessageResponse messageResponse = new MessageResponse(null);

        String newMessage = "This is a new test message.";
        messageResponse.setMessage(newMessage);

        assertEquals(newMessage, messageResponse.getMessage(), "The message should be correctly updated by the setter.");
    }
}

