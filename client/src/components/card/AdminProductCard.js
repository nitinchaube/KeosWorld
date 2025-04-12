import React from "react";
import { Card } from "antd";
import defaultImage from "../../images/defaultImage.png";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
  const { title, description, images, slug } = product;
  return (
    <Card
      hoverable
      cover={
        <img
          src={images && images.length ? images[0].url : defaultImage}
          style={{ height: "150px", objectFit: "cover" }}
          className="p-1"
        ></img>
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-warning" />
        </Link>,
        <DeleteOutlined
          className="text-danger"
          onClick={() => handleRemove(slug)}
        />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 50)}...`}
      />
    </Card>
  );
};

export default AdminProductCard;
