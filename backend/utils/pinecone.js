const { Pinecone } = require("@pinecone-database/pinecone");
const { generateEmbedding } = require("../Ai/gemini");

let pc;
let index;

try {
    if (process.env.PINECONE_API_KEY) {
        pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        index = pc.index(process.env.PINECONE_INDEX || "jobs-for-jobportal");
    } else {
        console.warn("PINECONE_API_KEY is not defined in the environment variables.");
    }
} catch (err) {
    console.error("Failed to initialize Pinecone client:", err.message);
}

/**
 * Format a job object into a string to be embedded.
 */
function formatJobText(job) {
    return `Job Title: ${job.title || ""}
Company: ${job.company || ""}
Location: ${job.location || ""}
Job Type: ${job.jobType || ""}
Salary: ${job.salary || 0}
Experience: ${job.experience || 0} years
Requirements: ${job.requirements || ""}
Description: ${job.description || ""}`;
}

/**
 * Upsert a single job into Pinecone DB.
 */
async function upsertJobToPinecone(job) {
    if (!index) {
        throw new Error("Pinecone index is not initialized. Please set PINECONE_API_KEY and PINECONE_INDEX.");
    }

    try {
        const text = formatJobText(job);
        const embedding = await generateEmbedding(text);

        await index.upsert({
            records: [
                {
                    id: job._id.toString(),
                    values: embedding,
                    metadata: {
                        title: job.title || "",
                        company: job.company || "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        salary: job.salary || 0,
                        experience: job.experience || 0,
                        requirements: job.requirements || "",
                        description: job.description || "",
                    }
                }
            ]
        });
        console.log(`Job ${job._id} upserted to Pinecone successfully.`);
    } catch (error) {
        console.error(`Failed to upsert job ${job._id} to Pinecone:`, error.message);
        throw error;
    }
}

/**
 * Upsert multiple jobs with precalculated embeddings to Pinecone.
 */
async function upsertManyJobsToPinecone(jobs, embeddings) {
    if (!index) {
        throw new Error("Pinecone index is not initialized. Please set PINECONE_API_KEY and PINECONE_INDEX.");
    }

    try {
        console.log("Jobs:", jobs.length);
        console.log("Embeddings:", embeddings.length);
        let records = [];
        for (let i = 0; i < embeddings.length; i++) {
            const job = jobs[i];
            records.push({
                id: job._id.toString(),
                values: embeddings[i],
                metadata: {
                    title: job.title || "",
                    company: job.company || "",
                    location: job.location || "",
                    jobType: job.jobType || "",
                    salary: job.salary || 0,
                    experience: job.experience || 0,
                    requirements: job.requirements || "",
                    description: job.description || "",
                }
            });
        }
        console.log("Sending all records to Pinecone...");
        await index.upsert({ records: records });
        console.log("All jobs upserted successfully.");
    } catch (error) {
        console.error("Failed to upsert jobs:", error.message);
        throw error;
    }
}

/**
 * Queries Pinecone for matching jobs using a profile embedding vector.
 * Returns an array of job ID strings.
 */
async function queryMatchingJobs(queryEmbedding, topK = 10) {
    if (!index) {
        throw new Error("Pinecone index is not initialized. Please set PINECONE_API_KEY and PINECONE_INDEX.");
    }

    try {
        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: topK,
            includeMetadata: false,
        });

        if (queryResponse && queryResponse.matches) {
            return queryResponse.matches.map(match => match.id);
        }
        return [];
    } catch (error) {
        console.error("Failed to query Pinecone database:", error.message);
        throw error;
    }
}

/**
 * Delete a single job from Pinecone DB.
 */
async function deleteJobFromPinecone(jobId) {
    if (!index) {
        throw new Error("Pinecone index is not initialized. Please set PINECONE_API_KEY and PINECONE_INDEX.");
    }

    try {
        await index.deleteOne({ id: jobId });
        console.log(`Job ${jobId} deleted from Pinecone successfully.`);
    } catch (error) {
        console.error(`Failed to delete job ${jobId} from Pinecone:`, error.message);
        throw error;
    }
}

module.exports = {
    upsertJobToPinecone,
    upsertManyJobsToPinecone,
    queryMatchingJobs,
    deleteJobFromPinecone,
    formatJobText
};
