const advancedResults = (Model, populate) => async(req, res, next) => {
    // Copy of the request query
    const reqQuery = {...req.query };

    // Fields to be exluded
    const excludedFields = ['select', 'sort', 'page', 'limit'];
    // Exclude Select fields
    excludedFields.forEach((param) => delete reqQuery[param]);

    // Request Query String
    let queryString = JSON.stringify(reqQuery);

    // Add '$' in front of the operation key
    queryString = queryString.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    // QUERY
    let query = Model.find(JSON.parse(queryString));
    // Select & Sort by fields
    if (req.query.select) {
        // Fields
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if (req.query.sort) {
        // Sort By
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination & limit
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populating
    if (populate) {
        query = query.populate(populate);
    }

    // Fetch Models from DataBase
    const results = await query;

    // Pagination Object
    const pagination = {};
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    // Advanced RESULTS
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };

    next();
};

module.exports = advancedResults;