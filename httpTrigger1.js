const { app } = require('@azure/functions');

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        let body = {};
                
        try {
            body = await request.json();
        } catch (error) {
            context.log('No valid JSON body provided, continuing with query parameters');
        }

        const ingredientName = request.query.get('name') || body.name;
        const recipePersons = request.query.get('persons') || body.persons;
        const targetPersons = request.query.get('targetPersons') || body.targetPersons;
        const recipeWeight = request.query.get('weight') || body.weight;

        if (!ingredientName || !recipePersons || !targetPersons || !recipeWeight) {
            return { status: 400, body: 'Please provide all required input parameters' };
        }

        const targetWeight = (targetPersons / recipePersons) * recipeWeight;

        return { body: `Für ${targetPersons} Personen braucht man ${targetWeight} Gramm ${ingredientName}!` };
    }
});
