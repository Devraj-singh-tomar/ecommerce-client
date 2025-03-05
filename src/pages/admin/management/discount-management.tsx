import { FaTrash } from "react-icons/fa6";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { FormEvent, useState } from "react";
import axios from "axios";
import { Rootstate, server } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// 2:57:30 timestamp ======== === == = = == = = = == = =
// To DO Add RTK query for all discount query ==================

const DiscountManagement = () => {
  const { user } = useSelector((state: Rootstate) => state.userReducer);

  const { id } = useParams();
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [codeUpdate, setCodeUpdate] = useState<string>("");
  const [amountUpdate, setAmountUpdate] = useState<number>(0);

  const deleteHandler = async () => {
    setBtnLoading(true);

    try {
      const { data } = await axios.delete(
        `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/discount");
      }
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
        {
          code: codeUpdate,
          amount: amountUpdate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setCodeUpdate("");
        setAmountUpdate(0);
        toast.success(data.message);
        navigate("/admin/discount");
      }
    } catch (error) {
      //   toast.error(error);
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const isLoading = false;

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="product-management">
        {isLoading ? (
          <Skeleton length={10} />
        ) : (
          <>
            <article>
              <button onClick={deleteHandler} className="product-delete-btn">
                <FaTrash />
              </button>

              <form onSubmit={submitHandler}>
                <h2>Manage</h2>

                <div>
                  <label>Coupon code</label>
                  <input
                    type="text"
                    placeholder="code"
                    value={codeUpdate}
                    onChange={(e) => setCodeUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={amountUpdate}
                    onChange={(e) => setAmountUpdate(Number(e.target.value))}
                  />
                </div>

                <button disabled={btnLoading} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default DiscountManagement;
