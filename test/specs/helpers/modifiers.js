let nextClosestSibling = {
    "next-closest-sibling": {
        browser: true,
        filter: function(elements, context) {
            if (!context) return [];

            var sibling = context.nextElementSibling;
            
            while (sibling) {
                if (elements.filter(e => e == sibling).length > 0)
                    return [sibling];

                sibling = sibling.nextElementSibling;
            }

            return [];
        }
    }
};

export {nextClosestSibling};