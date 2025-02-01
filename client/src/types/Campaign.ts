import Category from "./Category";
import User from "./User";
import Image from "./Image";
import Contribution from "./Contribution";
import Reward from "./Reward";

type Campaign = {
    id: number;
    title: string;
    tagline: string;
    description: string;
    creator: User;
    category: Category;
    goal_amount: number;
    current_amount: number;
    end_date: string;
    supporters: number;
    status: string;
    images: Image[];
    contributions: Contribution[];
    rewards: Reward[];
    created_at: string;
  };

export default Campaign