
export interface TVProps {
    game: string
}


export class TV extends React.Component<TVProps, any> {

    render() {
        return (
            <iframe className="tv" src={'http://vindinium.org/' + this.props.game}></iframe>
        )
    }

}