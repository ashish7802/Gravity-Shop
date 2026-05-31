import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { withErrorHandler } from "@/lib/api-error";

export const GET = withErrorHandler(async () => {
  await connectDB();

  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments({ status: { $ne: "cancelled" } });
  
  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  // Monthly Revenue
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyRevenue = await Order.aggregate([
    { 
      $match: { 
        status: { $ne: "cancelled" },
        createdAt: { $gte: sixMonthsAgo } 
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Transform monthly to friendly names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonthlyRevenue = monthlyRevenue.map(m => {
    const [year, month] = m._id.split("-");
    return { name: `${months[parseInt(month) - 1]} ${year}`, value: m.revenue };
  });

  // Top Selling Products using MongoDB Aggregation ($lookup)
  const topSellingProductsAgg = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    { 
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productData"
      }
    },
    { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
    { 
      $project: {
        name: { $ifNull: ["$productData.name", "Unknown"] },
        sold: "$totalSold",
        revenue: { $multiply: ["$totalSold", { $ifNull: ["$productData.price", 0] }] }
      }
    }
  ]);
  
  const topSellingProducts = topSellingProductsAgg;

  // Low stock products
  const lowStock = await Product.find({ stock: { $lt: 10 } }).select("name stock").limit(10);

  return NextResponse.json({
    totalUsers,
    totalOrders,
    totalRevenue,
    monthlyRevenue: formattedMonthlyRevenue,
    topSellingProducts,
    lowStock
  });
});
