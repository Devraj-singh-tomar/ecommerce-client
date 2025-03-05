import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Rootstate, server } from "../../../redux/store";

const NewDiscount = () => {
  const { user } = useSelector((state: Rootstate) => state.userReducer);

  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [code, setCode] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/coupon/new?id=${user?._id}`,
        {
          code,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setCode("");
        setAmount(0);
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

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="product-management">
        <>
          <article>
            <form onSubmit={submitHandler}>
              <h2>Create</h2>

              <div>
                <label>Coupon code</label>
                <input
                  type="text"
                  placeholder="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div>
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <button disabled={btnLoading} type="submit">
                Create
              </button>
            </form>
          </article>
        </>
      </main>
    </div>
  );
};

export default NewDiscount;
