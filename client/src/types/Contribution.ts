
interface Contribution {
    id: number;
    amount: number;
    contributor?: {
      id: string;
      name: string;
      avatar_url: string;
    };
    created_at: string;
  }
  

export default Contribution