const ConnectionError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="absolute left-1/2 top-1/2 z-50 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 border-6 border-black text-center press-start-2p-regular">
      <h1 className="text-lg text-red-600 mb-4">Connection Error</h1>
      <p className="mb-6">Unable to connect to the server. Please try again.</p>
      <button
        className="w-full   bg-slate-600 px-4 py-2 text-white font-medium hover:bg-slate-500 active:scale-95"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
};

export default ConnectionError;
