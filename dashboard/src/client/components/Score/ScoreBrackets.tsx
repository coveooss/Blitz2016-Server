/// <reference path="../../../../definitions/tsd.d.ts" />

export class ScoreBoard extends React.Component<any, any> {

    render() {
        return (
            <div className="container">
                <h1>Score</h1>
                <img className="scoreboard" src={`https://docs.google.com/drawings/d/1uC30vzP9vSg3kgBzneOciEOW5kXIjj7Wdu8DU-n24AQ/pub?w=2880&amp;h=1620&${new Date().getTime()}`}/>
            </div>
        );
    }
}