/// <reference path="../../../../definitions/tsd.d.ts" />

export interface AchievementNotificationProps {
    name: string;
    image: string;
    description: string;
    team: string;
}

const TRANSITION_DURATION = 1000;

export class AchievementNotification extends React.Component<AchievementNotificationProps, any> {

    constructor(props: AchievementNotificationProps) {
        super(props);

        this.state = {
            animation: 'bounceInUp'
        };
    }

    render() {
        return (
            <div className={`notification ${this.state.animation} animated`}>
                <audio autoPlay={true}>
                    <source src="sounds/achievement.mp3"/>
                </audio>
                <img className="logo" src="img/logo.png" alt="Coveo Blitz"/>

                <h2>Achievement unlocked - {this.props.team}</h2>
                <h1>{this.props.name}</h1>
                <p>{this.props.description}</p>
            </div>
        )
    }

    animateOut(callback?: Function) {
        this.setState({
            animation: 'bounceOutDown'
        });
        setTimeout(() => {
            if (callback) {
                callback();
            }
        }, TRANSITION_DURATION);
    }
}