import React from "react";
import { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
// import { listMarkets } from "../graphql/queries";
import { onCreateMarket } from "../graphql/subscriptions";
import { Loading, Card, Icon, Tag } from "element-react";
import { ReactComponent as CartIcon } from "../img/shopping_cart.svg";
import { ReactComponent as StorefrontIcon } from "../img/store_front.svg";
import { Link } from "react-router-dom";
import Error from "./Error";

const listMarkets = /* GraphQL */ `
  query ListMarkets(
    $filter: ModelMarketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMarkets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        products {
          items {
            id
          }
        }
        tags
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const MarketList = ({ searchResults }) => {
  const onNewMarket = (prevQuery, newData) => {
    let updatedQuery = { ...prevQuery };
    const updatedMarketList = [
      newData.onCreateMarket,
      ...prevQuery.listMarkets.items
    ]
    updatedQuery.listMarkets.items = updatedMarketList;
    return updatedQuery;
  }

  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}
    >
      {({ data, loading, errors }) => {
        if (errors.length > 0) return <Error errors={errors} />;
        if (loading || !data.listMarkets) return <Loading fullscreen={true} />;
        const markets = searchResults.length > 0 ? searchResults : data.listMarkets.items;

        return (
          // console.log(data)
          <React.Fragment>

            {searchResults.length > 0 ? (
              <h2 className="text-green">
                <Icon type={"success"} name={"check"} className={"icon"} />
                {searchResults.length} Results
              </h2>
            ) : (
              <h2 className="header">
                {/*<img src="https://icon.now.sh/store_mall_directory/527FFF" alt="Store Icon" className="large-icon"/>*/}
                <StorefrontIcon/>
                Markets
              </h2>
            )}

            {markets.map(market => (
              <div key={market.id} className={"my-2"}>
                <Card
                  bodyStyle={{
                    padding: "0.7em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <span className={"flex"}>
                      <Link className={"link"} to={`/markets/${market.id}`}>
                        {market.name}
                      </Link>
                      <span style={{ color: "var(--darkAmazonOrange" }}>
                        {market.products.items.length}
                      </span>
                      {/*<img src={"../img/shopping_cart.svg"} alt={"Shopping Cart"} />*/}
                      <CartIcon style={{ color: "var(--darkAmazonOrange"}} />
                    </span>
                    <div style={{ color: "var(--lightSquidInk" }}>
                      {market.owner}
                    </div>
                  </div>
                  <div>
                    {market.tags && market.tags.map(tag => (
                      <Tag key={tag} type={"danger"} className={"mx-1"}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </React.Fragment>
        );
      }}
    </Connect>
  );
};

export default MarketList;
