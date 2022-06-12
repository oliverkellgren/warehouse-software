import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { useProductsContext } from "../Contexts/ProductsContext";
import toast, { Toaster } from "react-hot-toast";
import { useInventoryContext } from "../Contexts/InventoryContext";

const Container = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  margin: "10rem auto 2rem auto",
  gap: "2rem",
});

const InfoWrapper = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  padding: "1rem",
});

const Img = styled.img({
  width: "350px",
  height: "350px",
  borderRadius: "5px",
});

const Ul = styled.ul({
  paddingInlineStart: "1rem",
  margin: "0.2rem",
});

const Button = styled.button({
  backgroundColor: "#b53f45",
  border: "none",
  color: "white",
  width: "fit-content",
  padding: "0.5rem 1.5rem",
  cursor: "pointer",
  marginTop: "1rem",
  "&:hover": {
    backgroundColor: "#9c2c31",
  },
});

const Product = () => {
  const { data: productsData } = useProductsContext();

  let { data: inventoryData, setData: setInventoryData } =
    useInventoryContext();

  const params = useParams();

  const product = productsData?.find(
    (product) => product?.product_id === params.id
  );

  const updateInventory = (product) => {
    let newStockArr = [];
    inventoryData?.map((item) => {
      return product?.contain_articles?.find((article) => {
        if (item.art_id === article.art_id) {
          newStockArr.push({
            art_id: item.art_id,
            name: item.name,
            stock: JSON.stringify(item.stock - article.amount_of),
          });
        }
      });
    });
    const updatedInventory = inventoryData?.map(
      (obj) => newStockArr?.find((o) => o.art_id === obj.art_id) || obj
    );

    setInventoryData(updatedInventory);

    toast.success("Inventory has been updated!");
  };

  useEffect(() => {
    console.log({ inventoryData });
  }, [inventoryData]);

  return (
    <>
      {product && (
        <Container>
          <Img src={product.image} alt="product" />
          <InfoWrapper>
            <h1>{product.name}</h1>
            <h3>{product.price}:-</h3>
            <br />
            <b>Contain Articles</b>
            {product.contain_articles.map((article) => (
              <div key={article.art_id}>
                <div>
                  <Ul>
                    <li>
                      {article?.name} x {article?.amount_of}
                      <div>
                        Stock:
                        {
                          inventoryData?.find(
                            (item) => item.art_id === article.art_id
                          )?.stock
                        }
                      </div>
                    </li>
                  </Ul>
                </div>
              </div>
            ))}
            <Button onClick={() => updateInventory(product)}>REMOVE</Button>
          </InfoWrapper>
          <Toaster position="top-right" />
        </Container>
      )}
    </>
  );
};

export default Product;
