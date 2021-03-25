import React, { Component, Fragment } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false
  };

  componentDidMount() {
    const graphqlQuery={
      query:`
      query{
        getUser
        {
         status
        }
      }
      `
    }
    fetch('http://localhost:8080/graphql',{
      method: 'POST',
      headers:
      {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData)
        if (resData.errors) {
          throw new Error('Failed to fetch user status.');
        }
        this.setState({ status: resData.data.getUser.status });
      })
      .catch(this.catchError);

    this.loadPosts();

  }

  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    const graphqlQuery = {
      query: `
      query{
        getPosts(page:${page})
        {
         posts
         {
          id
          title
          content
          creator{
            name
          }
          createdAt
         }
         totalItems
        }
      }
      `
    }
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers:
      {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {

        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Failed to fetch posts');
        }
        console.log(resData);
        this.setState({
          posts: resData.data.getPosts.posts,
          totalPosts: resData.data.getPosts.totalItems,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = event => {
    event.preventDefault();
    const graphqlQuery={
      query:`
      mutation UpdateStatus($status:String!)
      {
        updateStatus(status:$status)
        {
          status
        }
      }
      `,
      variables:{
        status:this.state.status
      }
    }
    fetch('http://localhost:8080/graphql',{
      method: 'POST',
      headers:
      {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
      
        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status===422) {
          throw new Error("Validation failed.Status cant be empty");
        }
        if (resData.errors) {
          throw new Error("Can't update status!");
        }
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p.id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = postData => {

    this.setState({
      editLoading: true
    });
    // Set up data (with image!)
    let graphqlQuery = {
      query: `
      mutation{
        addPost(postInput:{title:"${postData.title}",content:"${postData.content}"})
        {
          title
          content
          creator{
            name
          }
          createdAt
        }
      }
      `
    }

    if(this.state.editPost)
    {
      
      graphqlQuery = {
        query: `
        mutation{
          updatePost(id:${parseInt(this.state.editPost.id)},postInput:{title:"${postData.title}",content:"${postData.content}"})
          {
            title
            content
            creator{
              name
            }
            createdAt
          }
        }
        `
      }
    }
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token

      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {

        return res.json();
      })
      .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed.!"
          );
        }
        if (resData.errors) {
          console.log('Error!');
          throw new Error('Creating posts failed!');
        }
        console.log(resData)
        let resDataField='addPost';
        if(this.state.editPost)
        {
          resDataField='updatePost'
        }
        const post = {
          _id: resData.data[resDataField].id,
          title: resData.data[resDataField].title,
          content: resData.data[resDataField].content,
          creator: resData.data[resDataField].creator,
          createdAt: resData.data[resDataField].createdAt
        };
        this.setState(prevState => {
        //   let updatedPosts = [...prevState.posts];
        //   if (prevState.editPost) {
        //     const postIndex = prevState.posts.findIndex(
        //       p => p._id === prevState.editPost._id
        //     );
        //     updatedPosts[postIndex] = post;
        //   } else if (prevState.posts.length < 2) {
        //     updatedPosts = prevState.posts.concat(post);
        //   }
        //   return {
        //      posts: updatedPosts,
         return{   isEditing: false,
            editPost: null,
            editLoading: false
          };
        },()=>{
          if(!this.state.isEditing)
          this.loadPosts();
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    console.log(postId)
    const graphqlQuery={
      query:`
      mutation{
        deletePost(id:${parseInt(postId)})
      }
      `
    }
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type':'application/json'
      },
      body:JSON.stringify(graphqlQuery)
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error('Deleting a post failed!');
        }
        console.log(resData);
        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
        this.loadPosts();
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found in this Page.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post.id}
                  id={post.id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post.id)}
                  onDelete={this.deletePostHandler.bind(this, post.id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
