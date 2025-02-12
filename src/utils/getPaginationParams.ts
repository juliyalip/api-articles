export const getPaginationParams = (query: any) => {
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.limit as string, 10) || 4;
    const skip = (page - 1) * limit;
  
    return { page, limit, skip };
  };
  