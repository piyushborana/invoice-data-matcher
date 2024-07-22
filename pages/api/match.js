import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
    try {
        const { mon, fy } = req.query;
        const { db } = await connectToDatabase();

        // Fetch data from the collections
        const gstr2Data = await db.collection('gstr2').find({ mon: Number(mon), fy }).toArray();
        const purchasesData = await db.collection('purchases').find({ mon: Number(mon), fy }).toArray();

        const entriesInBoth = [];
        const onlyIn2Entries = [];
        const onlyInPurchaseEntries = [];

        const purchasesMap = new Map();

        purchasesData.forEach(entry => {
            const key = `${entry.ctin}-${entry.rt}-${entry.inum}`;
            purchasesMap.set(key, entry);
        });

        gstr2Data.forEach(entry => {
            const key = `${entry.ctin}-${entry.rt}-${entry.inum}`;
            const matchedEntry = purchasesMap.get(key);
            if (matchedEntry) {
                const exactMatch = (entry.date.getTime() === matchedEntry.date.getTime()) &&
                    (entry.gstAmount === matchedEntry.gstAmount) &&
                    (entry.invoiceValue === matchedEntry.invoiceValue);
                entriesInBoth.push({ ...entry, exactMatch });
                purchasesMap.delete(key);
            } else {
                onlyIn2Entries.push(entry);
            }
        });

        onlyInPurchaseEntries.push(...purchasesMap.values());

        // Return the data as JSON
        res.status(200).json({ entriesInBoth, onlyIn2Entries, onlyInPurchaseEntries });
    } catch (error) {
        console.error('Error in API route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}