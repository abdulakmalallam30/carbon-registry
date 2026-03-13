import { useRef } from 'react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const Certificate = ({ creditData, userName, onClose }) => {
  const certificateRef = useRef();

  const handleDownloadPDF = () => {
    if (certificateRef.current) {
      const element = certificateRef.current;
      const opt = {
        margin: 0,
        filename: `carbon-certificate-${creditData.id || Date.now()}.pdf`,
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-12 print:p-0 aspect-video flex flex-col justify-center items-center relative overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          {/* Certificate Content */}
          <div className="relative z-10 text-center space-y-6 w-full">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <div className="text-5xl">🌿</div>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                CARBON CREDIT CERTIFICATE
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            {/* Main Text */}
            <div className="space-y-4">
              <p className="text-gray-700 text-lg">This certifies that</p>
              <p className="text-3xl font-bold text-green-700">{userName || 'Certificate Holder'}</p>
              <p className="text-gray-700 text-lg">
                has successfully purchased and retired
              </p>
              <div className="flex items-center justify-center gap-4">
                <p className="text-5xl font-black text-emerald-600">{creditData?.amount || '0'}</p>
                <p className="text-2xl text-gray-700">Carbon Credits</p>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white/60 backdrop-blur px-8 py-4 rounded-xl inline-block max-w-2xl border-2 border-green-300">
              <p className="text-gray-700">
                {creditData?.projectName && (
                  <>
                    From Project: <span className="font-bold text-green-700">{creditData.projectName}</span>
                  </>
                )}
              </p>
            </div>

            {/* Impact */}
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">
                Equivalent to planting {Math.round((creditData?.amount || 0) * 16.7)} trees
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t-2 border-green-300">
              <p className="text-xs text-gray-600">
                Certified by Blue Carbon Registry | Certificate ID: {creditData?.id || 'BCR' + Date.now()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-8 py-6 flex gap-4 justify-center print:hidden border-t border-gray-200">
          <motion.button
            onClick={handleDownloadPDF}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📥 Download PDF
          </motion.button>

          <motion.button
            onClick={handlePrint}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-lg transition transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🖨️ Print
          </motion.button>

          <motion.button
            onClick={onClose}
            className="px-8 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg transition transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Certificate;
