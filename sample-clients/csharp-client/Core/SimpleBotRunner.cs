using System;
using System.Threading;

namespace CoveoBlitz
{
    /// <summary>
    /// SimpleBotRunner
    ///
    /// Runs a ISimpleBot with error handling
    /// </summary>
    public class SimpleBotRunner
    {
        private readonly ISimpleBot simpleBot;

        private readonly ApiToolkit api;

        private readonly bool showGame;

        /// <summary>
        /// Contructor
        /// </summary>
        /// <param name="api">The ApiToolit to use</param>
        /// <param name="simpleBot"The ISimplebot to run></param>
        /// <param name="showGame">Wetherwe want to open a game view</param>
        public SimpleBotRunner(ApiToolkit api, ISimpleBot simpleBot, Boolean showGame = true)

        {
            this.simpleBot = simpleBot;
            this.api = api;
            this.showGame = showGame;
        }

        /// <summary>
        /// Starts the game and runs the bot
        /// </summary>
        public void Run()
        {
            // Bot's setup
            simpleBot.Setup();

            // Connecting to the game
            api.CreateGame();

            if (api.errored == false)
            {
                // Opens up a game view
                if (showGame) {
                    new Thread(delegate() {
                        System.Diagnostics.Process.Start(api.viewURL);
                    }).Start();
                }

                // While the game is running, we ask the bot for his next move and
                // we send that to the server
                while (api.gameState.finished == false && api.errored == false)
                {
                    try
                    {
                        api.MoveHero(simpleBot.Move(api.gameState));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }
            }

            // Bot's shutdown step
            simpleBot.Shutdown();
        }
    }
}