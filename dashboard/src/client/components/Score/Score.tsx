/// <reference path="../../../../definitions/tsd.d.ts" />

export interface ScoreProps {
    key?: string;
    id: string;
    name: string;
    score: number;
    image: string;
}

export class Score extends React.Component<ScoreProps, any> {

    render() {
        return (
            <tr>
                <td>
                    <img height="60" width="60" src={this.props.image}/>
                </td>
                <td>
                    {this.props.name}
                </td>
                <td>
                    {this.props.score}
                </td>
            </tr>
        )
    }

}