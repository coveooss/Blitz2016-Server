package com.coveo.blitz.stress;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.coveo.blitz.client.Main.GameUrl;
import com.coveo.blitz.client.bot.RandomBot;
import com.coveo.blitz.client.bot.SimpleBotRunner;
import com.coveo.blitz.client.dto.ApiKey;
import com.coveo.blitz.client.dto.GameState;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.gson.GsonFactory;

public class StressTester
{
    private static String BASE_URL = "http://blitz2016.xyz:8080";

    private static List<String> BOT_KEYS = Arrays.asList("aua04w1y",
                                                         "pj8qq46q",
                                                         "hp77jjur",
                                                         "s61eapoc",
                                                         "m5x4komi",
                                                         "48aqpij2",
                                                         "y61r3eac",
                                                         "yyk1wn24",
                                                         "ywerpfx6",
                                                         "v99gjwl6",
                                                         "ewk2i6xv",
                                                         "84kzxnb4",
                                                         "yakxph6y",
                                                         "so2oie3d",
                                                         "zav9aqsh",
                                                         "3y7nddi5",
                                                         "87qj94sj");
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static HttpRequestFactory requestFactory = HTTP_TRANSPORT.createRequestFactory(request -> request.setParser(new JsonObjectParser(new GsonFactory())));

    public static void main(String[] args) throws Exception
    {
        System.out.println("Starting");
        int nbOfGames = 4;

        int botKeyIndex = 0;
        List<Thread> threads = new ArrayList<>();
        List<String> gameIds = new ArrayList<>();

        System.out.println("Creating games");
        for (int i = 0; i < nbOfGames; i++) {
            createGame();
        }
        Thread.sleep(1000);

        System.out.println("Adding bots to games");
        for (int i = 0; i < nbOfGames; i++) {

            String gameId = getGameIdOfNextGameToFill();
            gameIds.add(gameId);

            for (int j = 0; j < 4; j++) {
                System.out.println("Bot #" + botKeyIndex + " joining game " + gameId);
                SimpleBotRunner runner = new SimpleBotRunner(new ApiKey(BOT_KEYS.get(botKeyIndex)),
                                                             GameUrl.getCompetitionUrl(gameId),
                                                             new RandomBot());
                botKeyIndex++;
                Thread t = new Thread(runner::call);
                threads.add(t);
                t.start();
            }
            System.out.println("Game " + gameId + " is now full.");
        }

        Thread.sleep(5000);
        System.out.println("Starting games");
        gameIds.forEach(StressTester::startGame);

        System.out.println("Waiting for all games to be done.");
        threads.forEach(t -> {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        System.out.println("DONE!");
    }

    public static int game_index = 0;

    public static String getGameIdOfNextGameToFill()
    {
        try {
            HttpResponse response = requestFactory.buildGetRequest(new GenericUrl(BASE_URL
                    + "/games/active?apiKey=asdf")).execute();
            GameState.Game[] games = response.parseAs(GameState.Game[].class);
            String id = games[game_index].getId();
            game_index++;
            return id;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        //JsonNode json = Unirest.get(BASE_URL + "/games/active?apiKey=asdf").asJson().getBody();
        //String gameId = json.getArray().getJSONObject(game_index).getString("id");
    }

    public static void createGame()
    {
        try {
            HttpResponse response = requestFactory.buildPostRequest(new GenericUrl(BASE_URL
                                                                            + "/games?category=stress_test&apiKey=asdf"),
                                                                    null)
                                                  .execute();
            System.out.println(response.parseAsString());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        //            Unirest.post(BASE_URL + "/games?category=stress_test&apiKey=asdf").asString();
    }

    public static void startGame(String gameId)
    {
        System.out.println("Starting game " + gameId);
        try {
            HttpResponse response = requestFactory.buildPostRequest(new GenericUrl(BASE_URL + "/games/" + gameId
                                                                            + "/start?apiKey=asdf"),
                                                                    null).execute();
            System.out.println(response.parseAsString());
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
