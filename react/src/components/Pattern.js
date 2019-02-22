import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { get } from '../api';
import { UserContext } from '../App';

import LoadingIndicator from './LoadingIndicator';

class Pattern extends Component {
  state = {
    pattern: null,
    userPatterns: [],
    totalUserPatterns: 0,
    userPatternsLimit: 10,
    errorMessage: null,
    loading: true,
  };

  constructor(props) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    this.fetchPattern();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.location !== this.props.location) {
      window.scrollTo({top: 0});
      this.fetchPattern();
    }
  }

  fetchPattern() {
    this.setState({loading: true});

    get(`/patterns/${this.props.match.params.id}`)
      .then(pattern => {
        this.setState({pattern});
        // TODO: Set page title
        this.fetchUserPatterns(pattern.user._id);
      })
      .catch(err => {
        this.setState({errorMessage: 'Pattern not found.'});
      });
  }

  fetchUserPatterns(userId) {
    get(`/patterns/user/${userId}?page=1&limit=${this.state.userPatternsLimit}`)
      .then(response => {
        this.setState({
          userPatterns: response.patterns.filter(pattern => {
            return pattern._id !== this.state.pattern._id; // Filter out the pattern we're viewing
          }),
          totalUserPatterns: response.totalPatterns,
          loading: false,
        });
      });
  }

  delete() {
    if(this.state.pattern && window.confirm('Are you sure you want to delete this pattern?')){
      get(`/patterns/${this.state.pattern._id}`)
        .then(() => {
          this.props.history.push('/patterns');
        });
    }
  }

  render() {
    const { loading, pattern, userPatterns, totalUserPatterns, userPatternsLimit, errorMessage } = this.state;

    return (
        <UserContext.Consumer>{user =>
          <div>
            {loading ? <LoadingIndicator loading={loading}></LoadingIndicator> :
              <div>
                {errorMessage
                  ? <h1>{errorMessage}</h1>
                  : <div className='pattern-header'>
                      <div className='pattern-header-name'>{pattern.name}</div>
                      <div className='pattern-header-user'>by {pattern.user.displayName}</div>
                      <div className='pattern-header-description'>{pattern.description}</div>
                      {user._id === pattern.user._id && <button onClick={this.delete} className='delete-button'>Delete This Pattern</button>}
                    </div>
                }

                <div className='pattern-tile pattern-tile-full'>
                  <img src={pattern.imageUrl} alt={pattern.name}/>
                </div>

                <div className='pattern-tiles-container pattern-tiles-container-small'>
                  {userPatterns.length > 0 &&
                    <div className='user-patterns'>
                      <h3 className='pattern-tiles-container-header'>More patterns by {pattern.user.displayName}</h3>

                      {userPatterns.map(pattern => (
                        <span key={pattern._id}>
                          <Link to={`/pattern/${pattern._id}`} className='pattern-tile pattern-tile-small'>
                            <img src={pattern.imageUrl.replace('/upload', '/upload/c_thumb,w_100,h_100')} alt={pattern.name} />
                          </Link>
                        </span>
                      ))}

                      <div className='footer-navigation'>
                        {totalUserPatterns > userPatternsLimit &&
                          <Link to={`/patterns/user/${pattern.user._id}`} className='footer-link'>
                            See all patterns By {pattern.user.displayName}
                          </Link>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }</UserContext.Consumer>
    );
  }
}

export default Pattern;
