import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { Rootstate } from "../../../redux/store";
import { responsetoast } from "../../../utils/feature";
import { useFileHandler } from "6pp";

const Productmanagement = () => {
  const { user } = useSelector((state: Rootstate) => state.userReducer);

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const { category, name, photos, price, stock, description } =
    data?.product || {
      photos: [],
      category: "",
      name: "",
      stock: 0,
      price: 0,
      description: "",
    };

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);

  const [updateProduct] = useUpdateProductMutation();

  const [deleteProduct] = useDeleteProductMutation();

  const photosFiles = useFileHandler("multiple", 15, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const formData = new FormData();

      if (nameUpdate) formData.set("name", nameUpdate);
      if (descriptionUpdate) formData.set("description", descriptionUpdate);
      if (priceUpdate) formData.set("price", priceUpdate.toString());
      if (stockUpdate !== undefined)
        formData.set("stock", stockUpdate.toString());

      if (categoryUpdate) formData.set("category", categoryUpdate);

      if (photosFiles.file && photosFiles.file.length > 0) {
        photosFiles.file.forEach((file) => {
          formData.append("photos", file);
        });
      }

      const res = await updateProduct({
        formData,
        userId: user?._id!,
        productId: data?.product._id!,
      });

      responsetoast(res, navigate, "/admin/product");
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responsetoast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setDescriptionUpdate(data.product.description);
    }
  }, [data]);

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="product-management">
        {isLoading ? (
          <Skeleton length={10} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>

              <img src={photos[0]?.url} alt="Product" />
              <p>{name}</p>

              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button onClick={deleteHandler} className="product-delete-btn">
                <FaTrash />
              </button>

              <form onSubmit={submitHandler}>
                <h2>Manage</h2>

                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    required
                    placeholder="Product description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photos</label>
                  <input
                    multiple
                    accept="image/*"
                    type="file"
                    onChange={photosFiles.changeHandler}
                  />
                </div>

                {photosFiles.error && <p>{photosFiles.error}</p>}

                {photosFiles.preview && (
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      overflowX: "auto",
                    }}
                  >
                    {photosFiles.preview.map((img, i) => (
                      <img
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                        }}
                        key={i}
                        src={img}
                        alt="image"
                      />
                    ))}
                  </div>
                )}

                <button disabled={btnLoading} type="submit">
                  {btnLoading ? "Updating" : "Update"}
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
