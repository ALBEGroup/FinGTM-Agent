// Error state displayed when GTM generation fails
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-8 py-16">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-2">
        Generation Failed
      </h2>

      <div className="max-w-md mb-6">
        <p className="text-sm text-slate-500 mb-3">
          Something went wrong while generating your GTM pack.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
          <p className="text-sm text-red-700 font-mono break-all leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left max-w-md mb-6">
        <p className="text-xs font-semibold text-slate-700 mb-2">Common fixes:</p>
        <ul className="text-xs text-slate-600 space-y-1">
          <li>• Make sure the FastAPI backend is running on port 8000</li>
          <li>• Check that DEEPSEEK_API_KEY is set in your environment</li>
          <li>• Verify your DeepSeek API key has remaining credits</li>
          <li>• Try again — DeepSeek API may have brief outages</li>
        </ul>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
