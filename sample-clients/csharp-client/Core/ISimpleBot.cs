namespace CoveoBlitz
{
    public interface ISimpleBot
    {
        void Setup();

        void Shutdown();

        string Move(GameState state);
    }
}