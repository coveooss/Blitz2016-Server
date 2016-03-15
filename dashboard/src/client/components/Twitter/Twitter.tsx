/// <reference path="../../../../definitions/tsd.d.ts" />

declare var twttr: any;

export default class Twitter extends React.Component<any, any> {

    render() {
        return (
            <div className="container">
                <h1>#coveoblitz</h1>
                <div id="timeline"></div>
                <a className="twitter-timeline" href="https://twitter.com/hashtag/coveoblitz"
                   data-widget-id="685566364963225601"
                   data-chrome="noborders, nofooter"
                   width="1000"
                   height="700"
                >#coveoblitz Tweets</a>

            </div>
        )
    }

    componentDidMount() {
        if (twttr && twttr.widgets) {
            twttr.widgets.createTimeline(
                '685566364963225601',
                document.getElementById('timeline'),
                {
                    width: 1000,
                    height: 700,
                    related: 'twitterdev,twitterapi',
                    chrome: 'noborders, nofooter'
                }).then(function(el) {
                console.log("Embedded a timeline.")
            });
        }
    }
}