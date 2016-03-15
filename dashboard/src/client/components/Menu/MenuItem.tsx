/// <reference path="../../../../definitions/tsd.d.ts" />

export interface MenuItemProps {
    label: string;
    link: string;
    admin?: boolean;
}

export class MenuItem extends React.Component<MenuItemProps, any> {
    render() {
        return (
            <a href={this.props.link}>
                {this.props.label}
            </a>
        );
    }

}