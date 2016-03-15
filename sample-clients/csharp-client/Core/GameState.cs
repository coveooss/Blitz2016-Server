using System.Collections.Generic;

namespace CoveoBlitz
{
    public class GameState
    {
        public Hero myHero { get; set; }
        public List<Hero> heroes { get; set; }

        public int currentTurn { get; set; }
        public int maxTurns { get; set; }
        public bool finished { get; set; }
        public bool errored { get; set; }

        public Tile[][] board { get; set; }
    }
}