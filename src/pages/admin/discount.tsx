import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { AllDiscountResponse } from "../../types/api-types";
import { Rootstate, server } from "../../redux/store";
import { useSelector } from "react-redux";
import axios from "axios";

interface DataType {
  code: string;
  amount: number;
  _id: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Id",
    accessor: "_id",
  },
  {
    Header: "Code",
    accessor: "code",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },

  {
    Header: "Action",
    accessor: "action",
  },
];

const Discount = () => {
  const { user } = useSelector((state: Rootstate) => state.userReducer);

  const [rows, setRows] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const { data }: { data: AllDiscountResponse } = await axios.get(
          `${server}/api/v1/payment/coupon/all?id=${user?._id}`
        );

        setRows(
          data.coupons.map((i) => ({
            _id: i._id,
            code: i.code,
            amount: i.amount,
            action: <Link to={`/admin/discount/${i._id}`}>Edit</Link>,
          }))
        );
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchDiscount();
    }
  }, []);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main>{isLoading ? <Skeleton length={8} /> : Table}</main>

      <Link to="/admin/discount/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Discount;
