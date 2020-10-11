import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getMarket } from "../graphql/queries";
import { Loading, Tabs, Icon } from "element-react";
import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
import Product from "../components/Product";

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner: false
  };

  componentDidMount() {
    // console.log("[+] The MarketPage component mounts successfully.");
    this.handleGetMarket();
  }

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId
    };
    const result = await API.graphql(graphqlOperation(getMarket, input));
    this.setState({ market: result.data.getMarket, isLoading: false }, () => {
      this.checkMarketOwner()
    });
  };

  checkMarketOwner = () => {
    const { user } = this.props;
    const { market } = this.state;
    if (user) {
      this.setState({ isMarketOwner: user.username === market.owner });
    }
  };

  render() {
    const { market, isLoading, isMarketOwner } = this.state;
    return isLoading ? (
      <Loading fullscreen={true} />
    ) : (
      <React.Fragment>
        {/* Back Button */}
        <Link className={"link"} to={"/"}>
          Back to Markets List
        </Link>

        {/* Market MetaData */}
        <span className={"items-center pt-2"}>
          <h2 className="mb-mr">{market.name}</h2>- {market.owner}
        </span>
        <div className={"items-center pt-2"}>
          <span style={{ color: "var(--lightSquidInk", paddingBottom: "1em" }}>
            <Icon name={"date"} className={"icon"} />
            {market.createdAt}
          </span>
        </div>

        {/* New Product (tab 1) | Products (tab 2) */}
        <Tabs type={"border-card"} value={isMarketOwner ? "1" : "2"}>
          {isMarketOwner && (
            <Tabs.Pane
              label={
                <React.Fragment>
                  <Icon name={"plus"} className={"icon"} />
                  Add Product
                </React.Fragment>
              }
              name={"1"}
            >
              <NewProduct marketId={this.props.marketId} />
            </Tabs.Pane>
          )}

          {/* Products List */}
          <Tabs.Pane
            label={
              <React.Fragment>
                <Icon name={"menu"} className="icon" />
                Products ({ market.products.items.length})
              </React.Fragment>
            }
          >
            {/*<div className="product-list">*/}
            {/*  {market.products.items.map(product => (*/}
            {/*    <Product product={product} />*/}
            {/*  ))}*/}
            {/*</div>*/}
          </Tabs.Pane>
        </Tabs>
      </React.Fragment>
    )
  }
}

export default MarketPage;
