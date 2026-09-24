export const POST = async ({ request }) => {
    try {
        const { ids, dataType, language } = await request.json();
        const results = await checkMissingItems(ids, dataType, language);
        return new Response(JSON.stringify(results), { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error); // Add logging
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

async function checkMissingItems(ids, dataType, language) {
    const results = {};

    for (const id of ids) {
        try {
            const characterItems = await fetchCharacterItems(id, dataType, language);
            results[id] = characterItems;
        } catch (error) {
            console.error(`Error processing character ${id}:`, error);
            results[id] = { error: error.message };
        }
    }

    return results;
}

async function fetchCharacterInfo(id, language) {
    const response = await fetch(`https://ffxivcollect.com/api/characters/${id}?language=${language}`);
    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('API rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch character info for ID ${id}`);
    }
    return await response.json();
}

async function fetchCharacterItems(id, dataType, language) {
    const response = await fetch(`https://ffxivcollect.com/api/characters/${id}/${dataType}/missing?language=${language}`);
    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('API rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch character data for ID ${id}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error(`Unexpected data structure for character ${id}`);
    }
    return data;
}