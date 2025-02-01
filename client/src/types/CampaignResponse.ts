interface CampaignResponse {
    id: string;
    title: string;
    tagline: string;
    description: string;
    images: { url: string }[];
    category?: {
        id: number;
        name: string;
        image_url: string;
    };
    creator: {
        id: string;
        name: string;
        avatar_url: string;
    };
    current_amount: number;
    goal_amount: number;
    end_date: string;
    supporters: number;
    status: string;
    contributions?: {
        id: number;
        amount: number;
        contributor?: {
            id: string;
            name: string;
            avatar_url: string;
        };
        created_at: string;
    }[];  
    
    rewards?: {
        id: number;
        title: string;
        description: string;
        minimum_contribution: number;
        created_at: string;
    }[];  
    
    created_at: string;
}

export default CampaignResponse;
