import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Header } from "./Header";

// Project types with their shortforms
const PROJECT_TYPES = [
  { name: "New City", code: "NCG" },
  { name: "New City 1", code: "NCS" },
];

// Default form values
const defaultFormData = {
  societyName: "NAVANAGARA HOUSE BUILDING CO-OPERATIVE SOCIETY LTD.",
  societyNameKannada: "ನವನಗರ ಹೌಸ್ ಬಿಲ್ಡಿಂಗ್ ಕೋ-ಆಪರೇಟಿವ್ ಸೊಸೈಟಿ ಲಿ.",
  societyAddress:
    "No.1123, 'A' Block, 20th Cross, Sahakara Nagar, Bangalore - 560092",
  regNo: "Reg. No: JRB/RGN/CR-04/51588/2024-2025",
  website: "www.navanagarahousebuildingsociety.in",
  email: "E-navanagarahousingsociety@gmail.com",
  receiptNo: "",
  receiptDate: new Date().toISOString().split("T")[0],
  receivedFrom: "",
  membershipId: "",
  phoneNumber: "",
  Email: "",
  siteDimension: "",
  flatNumber: "",
  projectType: "New City",
  seniorityNumber: "",
  paymentType: "Booking Advance",
  paymentMode: "Cheque",
  bankName: "State Bank Of India",
  branch: "Banagiri Nagar Branch",
  chequeNo: "",
};

// Payment items list
const paymentItemsList = [
  "Share Value",
  "Membership fee",
  "Admission Fee",
  "Share Fee",
  "Deposits",
  "Booking Advance",
  "Down Payment",
  "1st Installment",
  "2nd Installment",
  "3rd Installment",
  "Penalty",
  "Miscellaneous",
];

// Membership fee breakdown for new members
const MEMBERSHIP_BREAKDOWN = {
  "Share Value": 2000,
  "Membership fee": 200,
  "Admission Fee": 150,
  "Share Fee": 150,
};

const TOTAL_MEMBERSHIP_FEE = 2500;

const ReceiptForm = ({ initialData = {}, onReceiptGenerate = null }) => {
  const [projectCodePreview, setProjectCodePreview] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentItemsError, setPaymentItemsError] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [memberExists, setMemberExists] = useState(false);
  const [hasExistingReceipt, setHasExistingReceipt] = useState(false);
  const [memberValidationMessage, setMemberValidationMessage] = useState("");
  const [isCheckingMember, setIsCheckingMember] = useState(false);
  const receiptRef = useRef(null);

  // Dropdown options
  const paymentModes = [
    "Cheque",
    "Cash",
    "Online Transfer",
    "DD",
    "UPI",
    "NEFT/RTGS",
  ];
  const paymentTypes = [
    "Booking Advance",
    "Installment Payment",
    "Full Payment",
    "Partial Payment",
    "Down Payment",
    "Penalty Payment",
  ];
  const banks = [
    "State Bank Of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Kotak Mahindra Bank",
    "IndusInd Bank",
  ];

  const branches = {
    "State Bank Of India": [
      "Banagiri Nagar Branch",
      "Sahakara Nagar Branch",
      "Banashankari Branch",
      "JP Nagar Branch",
    ],
    "HDFC Bank": [
      "Koramangala Branch",
      "Indiranagar Branch",
      "MG Road Branch",
      "Whitefield Branch",
    ],
    "ICICI Bank": [
      "Jayanagar Branch",
      "Malleshwaram Branch",
      "Electronic City Branch",
      "HSR Layout Branch",
    ],
    "Axis Bank": [
      "Marathahalli Branch",
      "BTM Layout Branch",
      "Yelahanka Branch",
      "Vijayanagar Branch",
    ],
    "Punjab National Bank": [
      "Rajajinagar Branch",
      "CV Raman Nagar Branch",
      "Basaveshwaranagar Branch",
    ],
    "Bank of Baroda": [
      "Majestic Branch",
      "Gandhinagar Branch",
      "KR Puram Branch",
    ],
    "Canara Bank": [
      "Basavanagudi Branch",
      "Malleshwaram Branch",
      "JP Nagar Branch",
    ],
    "Union Bank of India": [
      "Shivajinagar Branch",
      "Yeshwanthpur Branch",
      "Kengeri Branch",
    ],
    "Kotak Mahindra Bank": [
      "Brigade Road Branch",
      "Sarjapur Road Branch",
      "Bellandur Branch",
    ],
    "IndusInd Bank": [
      "Residency Road Branch",
      "Richmond Road Branch",
      "Old Airport Road Branch",
    ],
  };

  // Initialize payment items
  const [paymentItems, setPaymentItems] = useState(
    paymentItemsList.map((item) => ({
      name: item,
      checked: false,
      amount: 0,
    })),
  );

  // Check if member exists and if they have existing receipts
  const checkMemberAndReceipts = async (seniorityNumber) => {
    if (!seniorityNumber || seniorityNumber.length < 3) {
      setMemberExists(false);
      setHasExistingReceipt(false);
      setMemberValidationMessage("");
      return;
    }

    setIsCheckingMember(true);

    try {
      // Check members collection
      const membersResponse = await axios.get("https://navagara-backend.onrender.com/members");
      const members = membersResponse.data.data || [];
      const memberFound = members.find(
        (m) => m.seniority_no === seniorityNumber,
      );

      // Check sitebookings collection
      const sitebookingsResponse = await axios.get(
        "https://navagara-backend.onrender.com/sitebookings",
      );
      const sitebookings = sitebookingsResponse.data.data || [];
      const siteBookingFound = sitebookings.find(
        (s) => s.seniority_no === seniorityNumber,
      );

      // Check if member exists in either collection
      const exists = !!(memberFound || siteBookingFound);
      setMemberExists(exists);

      if (exists) {
        // Auto-fill name if found
        const foundMember = memberFound || siteBookingFound;
        if (foundMember && foundMember.name) {
          formik.setFieldValue("receivedFrom", foundMember.name);
        }

        // Auto-fill email if available
        if (foundMember && foundMember.email) {
          formik.setFieldValue("Email", foundMember.email);
        }

        // Auto-fill phone if available
        if (foundMember && foundMember.mobile) {
          formik.setFieldValue("phoneNumber", foundMember.mobile);
        }

        // Check receipts collection for existing receipts
        const receiptsResponse = await axios.get(
          "https://navagara-backend.onrender.com/receipts",
        );
        const receipts = receiptsResponse.data.data || [];
        const existingReceipt = receipts.find(
          (r) => r.seniority_no === seniorityNumber,
        );

        setHasExistingReceipt(!!existingReceipt);

        if (existingReceipt) {
          setMemberValidationMessage(
            "✅ Member found. Previous receipt exists - No membership fee required.",
          );
        } else {
          setMemberValidationMessage(
            "✅ Member found. First receipt - ₹2,500 membership fee will be added.",
          );
        }
      } else {
        setMemberValidationMessage(
          "❌ Member not found. Please add member first in Members or Site Booking.",
        );
      }
    } catch (error) {
      console.error("Error checking member:", error);
      setMemberValidationMessage(
        "⚠️ Error checking member details. Please check your connection.",
      );
      setMemberExists(false);
    } finally {
      setIsCheckingMember(false);
    }
  };

  // Validation Schema
  const validationSchema = Yup.object().shape({
    receiptNo: Yup.string()
      .required("Receipt number is required")
      .matches(
        /^[A-Z0-9-/]+$/i,
        "Only letters, numbers, hyphens, and slashes allowed",
      ),
    receiptDate: Yup.date().required("Date is required"),
    receivedFrom: Yup.string()
      .required("Received from name is required")
      .min(2, "Minimum 2 characters required")
      .matches(/^[a-zA-Z\s.]+$/, "Only letters, spaces, and periods allowed"),
    phoneNumber: Yup.string()
      .matches(
        /^(\+?[1-9]\d{0,3}|0)?[6-9]\d{9}$/,
        "Enter a valid contact number",
      )
      .required("Phone number is required"),
    Email: Yup.string()
      .required("Email is required")
      .email("Enter valid email"),
    flatNumber: Yup.string()
      .required("Address is required")
      .min(10, "Please provide complete address (minimum 10 characters)"),
    seniorityNumber: Yup.string().required("Seniority number is required"),
    paymentMode: Yup.string().required("Payment mode is required"),
    bankName: Yup.string().when("paymentMode", {
      is: (val) => val !== "Cash",
      then: (schema) =>
        schema.required("Bank name required for non-cash payments"),
      otherwise: (schema) => schema.notRequired(),
    }),
    branch: Yup.string().when("paymentMode", {
      is: (val) => val !== "Cash",
      then: (schema) =>
        schema.required("Branch name required for non-cash payments"),
      otherwise: (schema) => schema.notRequired(),
    }),
    chequeNo: Yup.string().when("paymentMode", {
      is: (val) => val !== "Cash",
      then: (schema) =>
        schema
          .required("Cheque/Transaction ID required for non-cash payments")
          .test("valid-format", function (value) {
            const { paymentMode } = this.parent;
            if (!value)
              return this.createError({
                message: "Required for non-cash payments",
              });

            if (paymentMode === "Cheque" || paymentMode === "DD") {
              if (!/^\d{6,10}$/.test(value)) {
                return this.createError({
                  message: "Cheque/DD number must be 6-10 digits",
                });
              }
            } else if (paymentMode === "UPI") {
              if (value.length < 12) {
                return this.createError({
                  message: "UPI transaction ID must be at least 12 characters",
                });
              }
            } else if (
              paymentMode === "Online Transfer" ||
              paymentMode === "NEFT/RTGS"
            ) {
              if (value.length < 10) {
                return this.createError({
                  message: "Transaction ID must be at least 10 characters",
                });
              }
            }
            return true;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: { ...defaultFormData, ...initialData },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (validatePaymentItems()) {
        setShowReceipt(true);
      }
    },
  });

  // Check member and receipts when seniority number changes
  useEffect(() => {
    checkMemberAndReceipts(formik.values.seniorityNumber);
  }, [formik.values.seniorityNumber]);

  // Validate payment items
  const validatePaymentItems = () => {
    const checkedItems = paymentItems.filter(
      (item) => item.checked && parseFloat(item.amount || 0) > 0,
    );

    if (checkedItems.length === 0) {
      setPaymentItemsError(
        "Select at least one payment item with valid amount",
      );
      return false;
    }

    const total = calculateTotal();
    if (total === 0) {
      setPaymentItemsError("Total amount cannot be zero");
      return false;
    }

    let hasInvalidAmount = false;
    checkedItems.forEach((item) => {
      const amount = parseFloat(item.amount);
      if (isNaN(amount) || amount <= 0 || amount > 100000000) {
        hasInvalidAmount = true;
      }
    });

    if (hasInvalidAmount) {
      setPaymentItemsError(
        "All amounts must be valid (greater than 0, less than 10 crores)",
      );
      return false;
    }

    setPaymentItemsError("");
    return true;
  };

  // Handle payment item changes
  const handlePaymentItemChange = (index, field, value) => {
    setPaymentItems((prev) => {
      const updated = [...prev];
      const itemName = updated[index].name;

      if (field === "checked") {
        if (MEMBERSHIP_BREAKDOWN[itemName] !== undefined) {
          updated[index] = {
            ...updated[index],
            checked: value,
            amount: value ? MEMBERSHIP_BREAKDOWN[itemName] : 0,
          };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }
      } else if (field === "amount") {
        if (MEMBERSHIP_BREAKDOWN[itemName] === undefined) {
          const numValue = parseFloat(value);
          if (
            value === "" ||
            (!isNaN(numValue) && numValue >= 0 && numValue <= 100000000)
          ) {
            updated[index] = { ...updated[index], [field]: value };
          }
        }
      }

      return updated;
    });

    if (field === "checked" && value === true) {
      setPaymentItemsError("");
    }
  };

  // Generate project code
  const generateProjectCode = () => {
    const selectedProject = PROJECT_TYPES.find(
      (p) => p.name === formik.values.projectType,
    );
    const shortForm = selectedProject?.code || "";
    const number = formik.values.seniorityNumber || "";
    const code = number ? `${shortForm}-${number}` : shortForm;
    setProjectCodePreview(code);
  };

  const getProjectCode = () => {
    const selectedProject = PROJECT_TYPES.find(
      (p) => p.name === formik.values.projectType,
    );
    const shortForm = selectedProject?.code || "";
    const number = formik.values.seniorityNumber || "";
    return number ? `${shortForm}-${number}` : shortForm;
  };

  // Convert number to words
  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    if (num === 0) return "Zero";

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return (
          tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
        );
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "")
      );
    };

    if (num < 1000) return convertLessThanThousand(num);

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    let result = "";
    if (crore > 0) result += convertLessThanThousand(crore) + " Crore ";
    if (lakh > 0) result += convertLessThanThousand(lakh) + " Lakh ";
    if (thousand > 0)
      result += convertLessThanThousand(thousand) + " Thousand ";
    if (remainder > 0) result += convertLessThanThousand(remainder);

    return result.trim();
  };

  // Calculate total
  const calculateTotal = () => {
    return paymentItems.reduce((sum, item) => {
      return sum + (item.checked ? parseFloat(item.amount || 0) : 0);
    }, 0);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Download PDF and Email
  const handleDownloadPDF = async () => {
    // Validate member exists first
    if (!memberExists) {
      toast.error(
        "❌ Member not found! Please add the member in Members or Site Booking first.",
      );
      return;
    }

    const errors = await formik.validateForm();
    formik.setTouched({
      receiptNo: true,
      receiptDate: true,
      receivedFrom: true,
      phoneNumber: true,
      Email: true,
      flatNumber: true,
      seniorityNumber: true,
      bankName: true,
      branch: true,
      chequeNo: true,
    });

    if (Object.keys(errors).length === 0 && validatePaymentItems()) {
      try {
        setIsGeneratingPDF(true);

        if (!showReceipt) {
          setShowReceipt(true);
          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        const html2canvas = (await import("html2canvas")).default;
        const jsPDF = (await import("jspdf")).default;

        const element = receiptRef.current;
        if (!element) throw new Error("Receipt element not found.");

        await new Promise((resolve) => setTimeout(resolve, 300));

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = 210;
        const pdfHeight = 297;
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let finalWidth = imgWidth;
        let finalHeight = imgHeight;

        if (imgHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = (canvas.width * pdfHeight) / canvas.height;
        }

        const xOffset = (pdfWidth - finalWidth) / 2;
        pdf.addImage(imgData, "PNG", xOffset, 0, finalWidth, finalHeight);

        const filename = `Receipt_${formik.values.receiptNo.replace(/[^a-zA-Z0-9]/g, "_") || "draft"}.pdf`;
        const pdfBase64 = pdf.output("datauristring").split(",")[1];

        // Send to backend
        try {
          const receiptPayload = {
            seniority_no: formik.values.seniorityNumber,
            membershipid: formik.values.seniorityNumber,
            name: formik.values.receivedFrom,
            projectname: formik.values.projectType,
            date: formik.values.receiptDate,
            amountpaid: total,
            mobilenumber: formik.values.phoneNumber,
            email: formik.values.Email,
            paymentmode: formik.values.paymentMode,
            paymenttype: formik.values.paymentType,
            transactionid: formik.values.chequeNo || formik.values.receiptNo,
            dimension: formik.values.siteDimension || "N/A",
            bank: formik.values.bankName || "N/A",
            created_by: "Admin",
            pdfBase64: pdfBase64,
            pdfFilename: filename,
          };

          const response = await axios.post(
            "https://navagara-backend.onrender.com/receipt",
            receiptPayload,
          );

          if (response.data.success) {
            toast.success("Receipt generated and emailed successfully!");
          }
        } catch (backendError) {
          console.error("⚠️ Backend error:", backendError);
          toast.warning(
            "Receipt generated but email sending failed. Please check backend.",
          );
        }

        setIsGeneratingPDF(false);
      } catch (error) {
        console.error("Error generating receipt:", error);
        toast.error(`Failed to generate receipt: ${error.message}`);
        setIsGeneratingPDF(false);
      }
    } else {
      setIsGeneratingPDF(false);
    }
  };

  const total = calculateTotal();
  const amountInWords = numberToWords(total);

  // Get detailed items list with membership fee logic
  const getDetailedItemsList = () => {
    const items = [...paymentItems];

    // Only add membership fee if member exists AND no previous receipt
    if (memberExists && !hasExistingReceipt) {
      const selectedIndex = items.findIndex(
        (item) =>
          item.checked &&
          !MEMBERSHIP_BREAKDOWN[item.name] &&
          item.amount >= TOTAL_MEMBERSHIP_FEE,
      );

      if (selectedIndex !== -1) {
        const selectedAmount = parseFloat(items[selectedIndex].amount || 0);

        // Deduct from first selected payment item
        items[selectedIndex] = {
          ...items[selectedIndex],
          amount: selectedAmount - TOTAL_MEMBERSHIP_FEE,
        };

        // Add membership fee breakdown
        Object.keys(MEMBERSHIP_BREAKDOWN).forEach((itemName) => {
          const itemIndex = items.findIndex((item) => item.name === itemName);
          if (itemIndex !== -1) {
            items[itemIndex] = {
              ...items[itemIndex],
              checked: true,
              amount: MEMBERSHIP_BREAKDOWN[itemName],
            };
          }
        });
      }
    }

    return items;
  };

  const detailedItems = getDetailedItemsList();

  // Receipt Content Component
  const ReceiptContent = () => (
    <div
      style={{
        border: "2px solid #000000",
        backgroundColor: "#ffffff",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "2px solid #000000",
          paddingBottom: "16px",
          marginBottom: "16px",
          marginLeft: "-20px", // ✅ Extend to left edge
          marginRight: "-20px", // ✅ Extend to right edge
          paddingLeft: "20px", // ✅ Maintain inner spacing
          paddingRight: "20px", // ✅ Maintain inner spacing
          gap: "16px",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <img
            src={formik.values.logo || "/images/logo.svg"}
            alt="Logo"
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            {formik.values.societyNameKannada}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            {formik.values.societyName}
          </div>
          <div style={{ fontSize: "11px", marginBottom: "2px" }}>
            {formik.values.societyAddress}
          </div>
          <div style={{ fontSize: "11px", marginBottom: "2px" }}>
            {formik.values.regNo}
          </div>
          <div style={{ fontSize: "11px" }}>
            <a
              href={`https://${formik.values.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#000000", textDecoration: "none" }}
            >
              {formik.values.website}
            </a>
            {" / "}
            <a
              href={`mailto:${formik.values.email}`}
              style={{ color: "#000000", textDecoration: "none" }}
            >
              {formik.values.email}
            </a>
          </div>
        </div>
        <div style={{ width: "80px", flexShrink: 0 }}></div>
      </div>

      {/* RECEIPT Label */}
       <div style={{ 
  textAlign: "center"
}}>
  <span style={{
    border: "2px solid #000000",
    fontWeight: "bold",
    fontSize: "14px",
    textAlign: "center",
    paddingBottom: "40px",
    padding: "5px"
  }}>
    RECEIPT
  </span>
</div>

      {/* Receipt Number and Date */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          fontSize: "13px",
          fontWeight: "bold",
        }}
      >
        <div>RECEIPT No. {formik.values.receiptNo}</div>
        <div>Date: {formatDate(formik.values.receiptDate)}</div>
      </div>

      {/* Received From Section */}
      <div style={{ fontSize: "13px", marginBottom: "16px" }}>
        <div style={{ marginBottom: "4px" }}>
          <strong>
            Received from Smt./Shree: {formik.values.receivedFrom}
          </strong>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <strong>Address: {formik.values.flatNumber}</strong>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <strong>Rupees: {amountInWords} Only.</strong>
        </div>
        <div>
          <strong>
            Seniority Number: {formik.values.projectType} ({getProjectCode()})
          </strong>
        </div>
      </div>

      {/* Payment Details Table */}
      <div style={{ marginBottom: "16px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000000",
            fontSize: "11px",
          }}
        >
          <thead>
            <tr>
              {[
                "Payment Type",
                "Payment For",
                "Payment Mode",
                "Bank",
                "Branch",
                "Cheque/Transaction ID",
                "Amount",
              ].map((header, i) => (
                <th
                  key={i}
                  style={{
                    border: "1px solid #000000",
                    padding: "6px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "10px",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "6px",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                {formik.values.paymentType}
              </td>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "6px",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                {formik.values.paymentType}
              </td>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "6px",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                {formik.values.paymentMode}
              </td>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "6px",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                {formik.values.paymentMode === "Cash"
                  ? ""
                  : formik.values.bankName}
              </td>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "6px",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                {formik.values.paymentMode === "Cash"
                  ? ""
                  : formik.values.branch}
              </td>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "6px",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                {formik.values.paymentMode === "Cash"
                  ? ""
                  : formik.values.chequeNo}
              </td>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "6px",
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                {total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Items Breakdown Table */}
      <div style={{ marginBottom: "16px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000000",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #000000",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "70%",
                }}
                colSpan="2"
              >
                Particulars
              </th>
              <th
                style={{
                  border: "1px solid #000000",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "5%",
                }}
              >
                L.F
              </th>
              <th
                style={{
                  border: "1px solid #000000",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "25%",
                }}
              >
                Rs.
              </th>
              <th
                style={{
                  border: "1px solid #000000",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "5%",
                }}
              >
                P
              </th>
            </tr>
          </thead>
          <tbody>
            {detailedItems.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #000000",
                    padding: "8px",
                    width: "5%",
                    textAlign: "center",
                  }}
                >
                  {index + 1}.
                </td>
                <td
                  style={{
                    border: "1px solid #000000",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{ border: "1px solid #000000", padding: "8px" }}
                ></td>
                <td
                  style={{
                    border: "1px solid #000000",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {item.checked && item.amount ? item.amount : "-"}
                </td>
                <td
                  style={{ border: "1px solid #000000", padding: "8px" }}
                >/-</td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold" }}>
              <td
                style={{ border: "1px solid #000000", padding: "8px" }}
                colSpan="2"
              >
                <strong>Total</strong>
              </td>
              <td style={{ border: "1px solid #000000", padding: "8px" }}></td>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {total}
              </td>
              <td style={{ border: "1px solid #000000", padding: "8px" }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Note */}
      <div
        style={{ fontSize: "11px", fontStyle: "italic", marginBottom: "32px" }}
      >
        *If 30% of the booking amount is not paid within 20 days from the date
        of booking, 10% penalty apply.
      </div>

      {/* Signatures */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "13px",
          marginTop: "40px",
        }}
      >
        <div>Party's Signature</div>
        <div>President/Secretary</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      <style>{`
        @media print {
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          html, body { height: 100%; overflow: visible; }
          .no-print { display: none !important; }
          .print-container { display: block !important; position: relative !important; left: 0 !important; visibility: visible !important; }
          .a4-receipt { box-shadow: none !important; margin: 0 !important; width: 210mm !important; min-height: 297mm !important; padding: 15mm !important; page-break-after: avoid !important; display: block !important; visibility: visible !important; }
          @page { size: A4 portrait; margin: 0; }
        }
        .a4-receipt { width: 210mm; min-height: 297mm; padding: 15mm; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.15); margin: 0 auto; box-sizing: border-box; }
        .receipt-panel { font-family: Arial, sans-serif; }
      `}</style>

      {/* Header Section */}
      <div>
        <Header />
      </div>

      <div className="max-w-4xl px-[50px] p-6">
        {/* Form Panel */}
        <h2 className="text-[24px] font-semibold text-gray-800 mb-4 mt-2">
              Receipt Form
            </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="no-print bg-[#FAF9FF] rounded-lg shadow-sm p-5">

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Receipt Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Receipt Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="receiptNo"
                    value={formik.values.receiptNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., RCP/2024/001"
                    className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      formik.touched.receiptNo && formik.errors.receiptNo
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  />
                  {formik.touched.receiptNo && formik.errors.receiptNo && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {formik.errors.receiptNo}
                    </p>
                  )}
                </div>

                {/* Seniority Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Seniority Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="seniorityNumber"
                      value={formik.values.seniorityNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="NCG-001"
                      className={`flex-1 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                        formik.touched.seniorityNumber &&
                        formik.errors.seniorityNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-purple-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={generateProjectCode}
                      className="px-4 py-1.5 bg-purple-500 text-white text-xs font-semibold rounded-md hover:bg-purple-600 transition"
                    >
                      Preview
                    </button>
                  </div>

                  {/* Validation Message */}
                  {isCheckingMember && (
                    <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-xs text-blue-800">
                        🔍 Checking member...
                      </p>
                    </div>
                  )}

                  {memberValidationMessage && !isCheckingMember && (
                    <div
                      className={`mt-1 p-2 border rounded-md ${
                        memberExists
                          ? hasExistingReceipt
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold ${
                          memberExists
                            ? hasExistingReceipt
                              ? "text-green-800"
                              : "text-yellow-800"
                            : "text-red-800"
                        }`}
                      >
                        {memberValidationMessage}
                      </p>
                    </div>
                  )}

                  {formik.touched.seniorityNumber &&
                    formik.errors.seniorityNumber && (
                      <p className="text-red-500 text-xs mt-0.5">
                        {formik.errors.seniorityNumber}
                      </p>
                    )}
                  {projectCodePreview && (
                    <div className="mt-1 p-2 bg-purple-50 border border-purple-200 rounded-md">
                      <p className="text-xs text-gray-600">Preview:</p>
                      <p className="text-sm font-bold text-purple-700">
                        {projectCodePreview}
                      </p>
                    </div>
                  )}
                </div>

                {/* Name (Auto-filled) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="receivedFrom"
                    value={formik.values.receivedFrom}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Auto-filled from database"
                    className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      formik.touched.receivedFrom && formik.errors.receivedFrom
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  />
                  {formik.touched.receivedFrom &&
                    formik.errors.receivedFrom && (
                      <p className="text-red-500 text-xs mt-0.5">
                        {formik.errors.receivedFrom}
                      </p>
                    )}
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="projectType"
                    value={formik.values.projectType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {PROJECT_TYPES.map((project) => (
                      <option key={project.name} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentType"
                    value={formik.values.paymentType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {paymentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMode"
                    value={formik.values.paymentMode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="chequeNo"
                    value={formik.values.chequeNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Transaction ID"
                    className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      formik.touched.chequeNo && formik.errors.chequeNo
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  />
                  {formik.touched.chequeNo && formik.errors.chequeNo && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {formik.errors.chequeNo}
                    </p>
                  )}
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Paid Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={`₹${total.toLocaleString()}`}
                    readOnly
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                  />
                </div>

                {/* Bank Name */}
                {formik.values.paymentMode !== "Cash" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Select Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bankName"
                      value={formik.values.bankName}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue("branch", "");
                      }}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                        formik.touched.bankName && formik.errors.bankName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-purple-500"
                      }`}
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    {formik.touched.bankName && formik.errors.bankName && (
                      <p className="text-red-500 text-xs mt-0.5">
                        {formik.errors.bankName}
                      </p>
                    )}
                  </div>
                )}

                {/* Branch */}
                {formik.values.paymentMode !== "Cash" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="branch"
                      value={formik.values.branch}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                        formik.touched.branch && formik.errors.branch
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-purple-500"
                      }`}
                      disabled={!formik.values.bankName}
                    >
                      <option value="">Select Branch</option>
                      {formik.values.bankName &&
                        branches[formik.values.bankName]?.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                    </select>
                    {formik.touched.branch && formik.errors.branch && (
                      <p className="text-red-500 text-xs mt-0.5">
                        {formik.errors.branch}
                      </p>
                    )}
                  </div>
                )}

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Auto-filled from database"
                    className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {formik.errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.Email}
                    placeholder="Auto-filled from database"
                    className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      formik.touched.Email && formik.errors.Email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  />
                  {formik.touched.Email && formik.errors.Email && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.Email}
                    </div>
                  )}
                </div>

                {/* Receipt Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Receipt Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="receiptDate"
                    value={formik.values.receiptDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    max={new Date().toISOString().split("T")[0]}
                    className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      formik.touched.receiptDate && formik.errors.receiptDate
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  />
                  {formik.touched.receiptDate && formik.errors.receiptDate && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {formik.errors.receiptDate}
                    </p>
                  )}
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="flatNumber"
                    value={formik.values.flatNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows="2"
                    placeholder="Complete address with pincode"
                    className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      formik.touched.flatNumber && formik.errors.flatNumber
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  />
                  {formik.touched.flatNumber && formik.errors.flatNumber && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {formik.errors.flatNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Payment Items <span className="text-red-500">*</span>
                </h3>

                {paymentItemsError && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-xs font-semibold">
                      {paymentItemsError}
                    </p>
                  </div>
                )}

                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {paymentItems.map((item, index) => {
                      const isMembershipItem =
                        MEMBERSHIP_BREAKDOWN[item.name] !== undefined;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-1.5 bg-gray-50 rounded hover:bg-gray-100 transition"
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(e) =>
                              handlePaymentItemChange(
                                index,
                                "checked",
                                e.target.checked,
                              )
                            }
                            className="w-3.5 h-3.5 cursor-pointer flex-shrink-0"
                          />
                          <label className="flex-1 text-xs font-medium text-gray-700 min-w-0">
                            {item.name}
                            {isMembershipItem && (
                              <span className="ml-1 text-xs text-blue-600">
                                (₹{MEMBERSHIP_BREAKDOWN[item.name]})
                              </span>
                            )}
                          </label>
                          <input
                            type="number"
                            value={item.amount || ""}
                            onChange={(e) =>
                              handlePaymentItemChange(
                                index,
                                "amount",
                                e.target.value,
                              )
                            }
                            disabled={isMembershipItem}
                            placeholder="₹"
                            min="0"
                            max="100000000"
                            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:border-purple-500 focus:outline-none disabled:bg-gray-100 flex-shrink-0"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div
                className={`border rounded-md p-3 ${total > 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
              >
                <div
                  className={`text-sm font-semibold ${total > 0 ? "text-green-800" : "text-gray-600"}`}
                >
                  Total Amount: ₹{total.toLocaleString("en-IN")}
                </div>
                <div
                  className={`text-xs mt-0.5 ${total > 0 ? "text-green-600" : "text-gray-500"}`}
                >
                  {total > 0
                    ? `${amountInWords} Rupees Only`
                    : "No amount selected"}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF || !memberExists}
                  className={`px-10 py-2 bg-gradient-to-r from-yellow-400 via-purple-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                    isGeneratingPDF || !memberExists
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isGeneratingPDF ? "Generating..." : "GENERATE RECEIPT"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Hidden receipt for PDF */}
        <div
          className="print-container"
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "210mm",
            backgroundColor: "#ffffff",
          }}
        >
          <div className="a4-receipt receipt-panel" ref={receiptRef}>
            <ReceiptContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
