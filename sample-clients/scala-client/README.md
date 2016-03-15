## Develop / run

```
sbt -Dkey=mySecretKey

Training mode, 30 turns:
> run training 30

Arena mode:
> run arena gameId
```

## Package as single jar

From sbt, run:

```
> one-jar
```
or
```
sbt one-jar
```

You can now run the application without sbt:

Training:
```
java -Dkey=mySecretKey -jar target/scala-2.10/blitz-bot_2.10-0.1-one-jar.jar training 30
```

Competition:
```
java -Dkey=mySecretKey -jar target/scala-2.10/blitz-bot_2.10-0.1-one-jar.jar arena GAME_ID
```
