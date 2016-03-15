package com.coveo.blitz.stress;

public class RegisteredBot
{
    private String name;
    private String key;

    public RegisteredBot(String name,
                         String key)
    {
        this.name = name;
        this.key = key;
    }

    public String getName()
    {
        return name;
    }

    public String getKey()
    {
        return key;
    }
}
