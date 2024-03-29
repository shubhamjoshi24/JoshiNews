import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 6,
        category: 'general'
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            Gif: false,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - Joshi News`;
    }

    async updateNews() {
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0db06d913eb24c6b9f8be391f0ef9a44&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ Gif: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            Gif: false
        })
    }

    async componentDidMount() {
        this.updateNews();
    }

    PreviosClick = async () => {
        this.setState({ page: this.state.page - 1 });
        this.updateNews();
    }

    NextClick = async () => {
        this.setState({ page: this.state.page + 1 });
        this.updateNews();
    }

    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 });

        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0db06d913eb24c6b9f8be391f0ef9a44&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ Gif: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
            Gif: false
        })

    };

    render() {
        return (
            <div className='container my-3'>
                <h1 className="text-center" style={{ margin: '35px 0px' }}>Joshi News - Top {this.capitalizeFirstLetter(this.props.category)} Headlines </h1>
                {/* {this.state.Gif && < Spinner />} */}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">

                        <div className="row">
                            {this.state.articles.map((element, index) => {
                                return <div className="col-md-4" key={index}>
                                    <NewsItem
                                        title={element.title}
                                        description={element.description}
                                        imageUrl={element.urlToImage}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source.name}
                                    />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
            </div >
        )
    }
}

export default News
