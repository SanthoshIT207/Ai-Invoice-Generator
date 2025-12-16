const Invoice = require("../models/Invoice");

exports.createInvoice = async (req, res) => {
    try{
        const user = req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms
        } = req.body;

        let subtotal = 0;
        let taxTotal = 0;
        items.forEach((item) => {
            subtotal += item.unitPrice * item.quantity;
            taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0 )) / 100;
        });

        const total = subtotal + taxTotal;
        
        const invoice = new Invoice({
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            subtotal,
            taxTotal,
            total,
        });

        await invoice.save();
        res.status(201).json(invoice);

    }  catch(error) {
        res
        .status(500)
        .json({ message: "Error creating invoice", error: error.message });
    }
};

exports.getInvoices = async (req, res) => {
    try{
       const invoices = await Invoice.find({user: req.user.id}).populate("user", "name email");
       res.json(invoices);

    }  catch(error) {
        res
        .status(500)
        .json({ message: "Error fetching invoice", error: error.message });
    }};



// -----------------------------------------------------------
// ONLY THIS PART UPDATED — EVERYTHING ELSE SAME
// -----------------------------------------------------------

exports.getInvoiceById = async (req, res) => {
    try{
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        if(!invoice) return res.status(404).json({ message: "Invoice not found" });

        
        const invoiceUserId =
        invoice.user && invoice.user._id
        ? invoice.user._id.toString()
        : invoice.user.toString();
        //changed here for invoice detail ._id.toString()
        if (invoiceUserId !== req.user.id){
            return res.status(401).json({ message: "Not authorized"});
        }
        // if(invoice.user.toString() ! == req.user.id){
        //     return res.status(401).json({message: "Not authorized"});
        // }

        res.json(invoice);
    }  catch(error) {
        res
        .status(500)
        .json({ message: "Error fetching invoice", error: error.message });
    }
};
    

// -----------------------------------------------------------
// REMAINING CODE EXACTLY SAME AS YOUR TRAINER'S
// -----------------------------------------------------------

exports.updateInvoice = async (req, res) => {
    try{
        const{
        invoiceNumber,
        invoiceDate,
        dueDate,
        billFrom,
        billTo,
        items,
        notes,
        paymentTerms,
        status,
        } = req.body;

        let subtotal = 0;
        let taxTotal = 0;
        if (items && items.length > 0) {
            items.forEach((item) => {
                subtotal += item.unitPrice * item.quantity;
                taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
            });
        }
        const total = subtotal + taxTotal;
        const updateInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                invoiceNumber,
                invoiceDate,
                dueDate,
                billFrom,
                billTo,
                items,
                notes,
                paymentTerms,
                status,
                subtotal,
                taxTotal,
                total
            },
            { new: true }
        );

        if (!updateInvoice) return res.status(404).json({ message: "Invoice not found" });
        res.json(updateInvoice);

    }  catch(error) {
        res
        .status(500)
        .json({ message: "Error updating invoice", error: error.message });
    }
};

exports.deleteInvoice = async (req, res) => {
    try{
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({message: "Invoice not found" });
        res.json({message: "Invoice deleted successfully" });
    }  catch(error) {
        res
        .status(500)
        .json({ message: "Error deleting invoice", error: error.message });
    }
};
