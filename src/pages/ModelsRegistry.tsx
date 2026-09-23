import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ModelVersion, DetectionRule } from '../types';
import { Sliders, Cpu, FileText, CheckCircle, Edit3, Save } from 'lucide-react';

export const ModelsRegistry: React.FC = () => {
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [tempThreshold, setTempThreshold] = useState<number>(0);

  const loadData = async () => {
    try {
      const [modelsRes, rulesRes] = await Promise.all([
        api.getModels(),
        api.getRules()
      ]);
      setModels(modelsRes);
      setRules(rulesRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartEdit = (rule: DetectionRule) => {
    setEditingRuleId(rule.id);
    setTempThreshold(rule.threshold);
  };

  const handleSaveEdit = async (ruleId: string) => {
    try {
      await api.updateRule(ruleId, { threshold: tempThreshold });
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, threshold: tempThreshold } : r))
      );
      setEditingRuleId(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="tour-models-tab" className="space-y-4 animate-fadeIn pb-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-red-600" />
          <span>AI/ML Model Registry & Detection Rules</span>
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Model performance provenance, precision/recall metrics, and dynamic threshold calibration.
        </p>
      </div>

      {/* Models Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="w-4 h-4 text-slate-700" />
          <span>Active Machine Learning Threat Classifiers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {models.map((m) => (
            <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-xs text-slate-900">{m.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {m.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-normal">Version: {m.version} | Type: {m.model_type}</p>
                </div>
              </div>

              {/* Evaluation Metrics */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">F1 Score</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{(m.f1_score * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Precision</span>
                  <p className="font-bold text-slate-900 mt-0.5">{(m.precision * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Recall</span>
                  <p className="font-bold text-slate-900 mt-0.5">{(m.recall * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Latency</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{m.inference_latency_ms.toFixed(2)} ms</p>
                </div>
              </div>

              {/* Feature Inputs */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                  Features Used ({m.features_used?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {m.features_used?.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Section */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-slate-700" />
          <span>Configurable Detection Rule Thresholds</span>
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <table className="soc-table">
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Rule Name</th>
                <th>Threat Class</th>
                <th>Severity</th>
                <th>Threshold</th>
                <th>Unit</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50 font-medium">
                  <td className="font-bold text-slate-900">{rule.id}</td>
                  <td className="font-semibold text-slate-800">{rule.name}</td>
                  <td className="text-slate-600">{rule.threat_class}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                      {rule.severity}
                    </span>
                  </td>
                  <td className="font-bold text-slate-900">
                    {editingRuleId === rule.id ? (
                      <input
                        type="number"
                        step="0.1"
                        value={tempThreshold}
                        onChange={(e) => setTempThreshold(parseFloat(e.target.value))}
                        className="w-20 px-2 py-0.5 bg-white border border-red-500 rounded text-slate-900 text-xs font-bold"
                      />
                    ) : (
                      rule.threshold
                    )}
                  </td>
                  <td className="text-slate-500 text-[11px] font-normal">{rule.unit}</td>
                  <td className="text-right">
                    {editingRuleId === rule.id ? (
                      <button
                        onClick={() => handleSaveEdit(rule.id)}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center space-x-1 shadow-sm"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(rule)}
                        className="px-2 py-1 rounded-md text-red-600 hover:text-red-700 inline-flex items-center space-x-1 font-bold text-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
