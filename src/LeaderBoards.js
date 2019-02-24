import React, { Component } from 'react';


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null,
            html: null
        }

        this.pushScore = this.pushScore.bind(this);
    }

    fetchData() {
        fetch('https://ajpears-leaderboards.herokuapp.com/players')
            .then(response => response.json())
            .then(data => {

                data.sort((l, r) => {// eslint-disable-next-line
                    return (l.playerScore == r.playerScore ? 0 : (l.playerScore < r.playerScore ? 1 : -1));
                });

                this.setState({
                    list: data,
                    html: data.map((item, index) => {
                        return (<tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.playerName}</td>
                            <td>{item.playerScore}</td>
                        </tr>)
                    })
                });
            });
    }

    componentDidMount() {
        this.fetchData();
    }

    pushScore() {
        let elem = {
            playerName: document.getElementById('playerName').value,
            playerScore: document.getElementById('playerScore').innerText
        }

        if (!this.state.list.some((li) => { return li.playerName === elem.playerName; })) {

            // let temp = this.state.list;
            // temp.push(elem);

            fetch('https://ajpears-leaderboards.herokuapp.com/players', {
                method: 'post',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(elem)
            });
        } else {
            fetch('https://ajpears-leaderboards.herokuapp.com/player/' + elem.playerName, {
                method: 'put',
                headers: {
                    "Content-type": "application/json"
                },
                body: '{"playerScore":"' + elem.playerScore + '"}'
            });
        }

        setTimeout(() => {
            //console.log("1 sec")
            this.fetchData();
        }, 1000);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <div className="ml-auto">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <input type="text" id="playerName" name="playerName" placeholder="Playername" />
                                </div>
                                <div id="playerScore" className="input-group-text">0</div>
                                <div className="input-group-append">
                                    <button type="submit" className="btn btn-primary" onClick={this.pushScore}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="card-title"><strong>Leaderboard</strong></div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Player Name</th>
                                    <th scope="col">Previous Score</th>
                                </tr>
                            </thead>
                            <tbody id="tableRows">
                                {this.state.html}
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        );
    }
}