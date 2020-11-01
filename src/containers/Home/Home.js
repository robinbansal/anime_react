import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { callApi } from "../../reducer/anime";

class Home extends Component {
  state = {
    query: "",
    page: 1,
    existingQuery: "",
  };

  submit = (e) => {
    e.preventDefault();
    const { query } = this.state;
    const { callApi } = this.props;
    this.setState({ ...this.state, page: 1, existingQuery: query });
    callApi(query, 1, false);
  };

  loadMore = () => {
    const { query, page, existingQuery } = this.state;
    const { callApi } = this.props;
    if (existingQuery === query) {
      this.setState({ page: page + 1 });
      callApi(query, page + 1, true);
    } else {
      this.setState({ page: 1 });
      callApi(query, 1, true);
    }
    // console.log("load page no.", this.state.page);
  };

  renderName = (name) => {
    // if (name.length > 16) {
    //   return name.substring(0, 12) + "...";
    // }
    return name;
  };

  render() {
    const { query } = this.state;
    const { anime } = this.props;
    return (
      <>
        <header>
          <div className="search-wrapper">
            <form onSubmit={this.submit}>
              <input
                onChange={(e) => {
                  this.setState({ query: e.target.value, page: 1 });
                }}
                value={query}
              />
              <button type="submit"> GO </button>
            </form>
          </div>
        </header>

        <div className="anime-flex">
          {anime &&
            anime.data &&
            anime.data.results &&
            anime.data.results.map((item) => {
              return (
                <div className="anime-card" key={item.image_url}>
                  <img src={item.image_url} alt="" />
                  <p>{this.renderName(item.title)}</p>
                </div>
              );
            })}
        </div>
        {anime && anime.loading && (
          <div className="load-wrap">
            <div className="loader"></div>
          </div>
        )}
        {anime && anime.data && anime.data.results && (
          <button className="button" onClick={this.loadMore}>
            Load More
          </button>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  anime: state.anime,
});

const mapDispatchToProps = (dispatch) => ({
  callApi: (query, pageNo, loadMore) =>
    dispatch(callApi(query, pageNo, loadMore)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
