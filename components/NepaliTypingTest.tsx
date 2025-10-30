"use client";
import React, { useState, useEffect, useRef } from "react"; // Removed useMemo
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Trophy, Clock, Zap, Target } from "lucide-react";

const STORAGE_KEY = "nepaliTyping_v38";
const THEME_KEY = "nepaliTypingTheme_v38";

const samples: string[] = [
  "नेपाल एक सुन्दर देश हो। यहाँका पहाड, हिमाल र तराईका हरिया जंगलहरूले यस देशलाई अझ सुन्दर बनाएका छन्। यहाँका मानिसहरू मिहिनेती र सहयोगी स्वभावका छन्।",
  "म बिहान छिट्टै उठ्छु र व्यायाम गर्छु। त्यसपछि म बिहानको खाजा खाएर पढ्न बस्छु। म सधैं समयको सम्मान गर्छु।",
  "तपाईंलाई कस्तो छ? मलाई त अहिले निकै राम्रो लागेको छ। आजको दिन रमाइलो र शान्त महसुस भइरहेको छ।",
  "म संग एउटा नयाँ किताब छ जसको नाम 'मुनामदन' हो। यो किताबले प्रेम र समर्पणको गहिरो कथा बताउँछ।",
  "हाम्रो विद्यालय ठूलो र सफा छ। शिक्षकहरू मिहिनेती छन् र विद्यार्थीहरू अध्ययनशील छन्। हामी प्रत्येक बिहान प्रार्थना गर्छौं।",
  "उनी राम्रो गीत गाउछन् र वाद्ययन्त्र पनि बजाउँछन्। संगीतप्रति उनको गहिरो लगाव छ। उनी कार्यक्रमहरूमा पनि प्रस्तुति दिन्छन्।",
  "काठमाडौं नेपालको राजधानी हो जहाँ धेरै मन्दिर र ऐतिहासिक दरबारहरू छन्। यहाँको सडकहरू व्यस्त छन् तर मानिसहरू निकै मिलनसार छन्।",
  "आज मौसम धेरै राम्रो छ। आकाश निलो छ र हल्का हावा चलिरहेको छ। यस्तो मौसममा हिँड्न निकै आनन्द लाग्छ।",
  "म कम्प्युटरमा नेपाली टाइप गर्दैछु र गति बढाउने प्रयास गर्दैछु। टाइपिङ्गले मलाई लेखाइमा दक्ष बनाएको छ।",
  "हिजो म बजार गएको थिएँ र केही फलफूल किनें। बजारमा भीड थियो तर सबै मानिसहरू मुस्कुराइरहेका थिए।",
  "यहाँको खाना स्वादिलो छ र परिकारहरू विविध छन्। दालभात, गुन्द्रुक, ढिडो र अचार सबैको मनपर्ने हुन्छ।",
  "हामीले विद्यालयमा अध्ययन गर्छौं र खेलकुदमा पनि भाग लिन्छौं। शिक्षा र खेल दुवै जीवनमा महत्त्वपूर्ण हुन्छन्।",
  "म नेपालीमा लेख्न सिक्दैछु र हरेक दिन नयाँ शब्दहरू अभ्यास गर्छु। यसले मलाई मातृभाषा नजिक ल्याएको छ।",
  "त्यो गाडी रातो रङको छ र निकै आकर्षक देखिन्छ। चालकले सावधानीका साथ गाडी चलाइरहेका छन्।",
  "म सधैं समयमै काम गर्छु र ढिलाइ गर्न मन पराउँदिन। अनुशासनले सफलताको बाटो खोल्छ भन्नेमा म विश्वास गर्छु।",
  "बुबा अफिस गएका छन् र आमा घरमा खाना बनाउँदै हुनुहुन्छ। म भने पढाइमा ध्यान दिइरहेको छु।",
  "आमा मिठो खाना बनाउँदै हुनुहुन्छ र पुरै घरमा गन्ध फैलिएको छ। हामी सबै परिवारले सँगै खानपिन गर्छौं।",
  "त्यो केटी हाँस्दैछे र उसको हाँसोले सबैको मन जितेको छ। ऊ पढाइमा पनि निकै तेज छ।",
  "काठमाडौँ उपत्यकामा धेरै मन्दिरहरू छन् जसले हाम्रो संस्कृति झल्काउँछन्। पशुपतिनाथ र स्वयम्भू त्यसमध्ये प्रसिद्ध हुन्।",
  "मैले नयाँ मोबाइल किनें र त्यसमा नेपाली किबोर्ड इन्स्टल गरें। अब म सजिलै नेपालीमा टाइप गर्न सक्छु।",
  "पानी पिउनु स्वास्थ्यका लागि राम्रो हुन्छ। पर्याप्त पानीले शरीरलाई ताजा र ऊर्जावान राख्छ।",
  "म मेरो साथीसँग फुटबल खेल्छु र कहिलेकाहीँ क्रिकेट पनि खेल्छौं। खेलकुदले हाम्रो शरीर बलियो बनाउँछ।",
  "हामीले नेपाल भ्रमण गर्नुपर्छ किनकि यसमा अद्भुत प्राकृतिक सौन्दर्य छ। हिमालदेखि तराईसम्म सबै ठाउँ रमणीय छन्।",
  "म बिहान ६:३० बजे उठ्छु र ध्यान गर्छु। त्यसपछि म पढ्न बस्छु र दिनलाई उत्पादक बनाउँछु।",
  "सगरमाथा विश्वकै अग्लो हिमाल हो। यसले नेपाललाई विश्वमा चिनाएको छ र हजारौं पर्यटक यहाँ आउँछन्।",
  "उनको नाम कृष्ण शर्मा हो र उनी एक इमानदार शिक्षक हुन्। विद्यार्थीहरू उनलाई धेरै माया गर्छन्।",
  "गाई हाम्रो राष्ट्रिय जनावर हो। यसले दूध दिन्छ र हाम्रो संस्कृतिमा पूजनीय मानिन्छ।",
  "बालबालिकाले इमानदार र परिश्रमी हुनुपर्छ। राम्रो बानीले भविष्य उज्यालो बनाउँछ।",
  "यहाँ धेरै राम्रा मानिसहरू छन् जो सहयोग गर्न सधैं तयार हुन्छन्। यही संस्कारले हाम्रो समाजलाई मजबुत बनाएको छ।",
  "मलाई कपिलवस्तु जान मन छ किनकि त्यो बुद्धको जन्मस्थल हो। त्यहाँको वातावरण शान्त र पवित्र छ।",
  "आज बुधबार हो र विद्यालयमा विशेष कार्यक्रम भएको छ। विद्यार्थीहरूले नाटक र गीत प्रस्तुत गरेका छन्।",
  "म टाइपिङ अभ्यास गर्दैछु र हरेक दिन प्रगति गरिरहेको छु। मेरो औंलाहरू अहिले छिटो चल्न थालेका छन्।",
  "नेपाली कीबोर्डमा टाइप गर्न सुरुमा सजिलो लाग्दैन तर अभ्यासले सबै सम्भव हुन्छ। निरन्तरता नै सफलता हो।",
  "तर म हिम्मत छोड्दिन र मिहिनेत गर्न तयार छु। प्रत्येक गल्तीबाट केही नयाँ सिक्छु।",
  "म अंग्रेजी र नेपाली दुवै जान्दछु र दुवै भाषामा लेख्न मन पर्छ। भाषाले सोच्ने तरिका फरक पार्छ।",
  "क्यान्डी मीठो हुन्छ तर धेरै खानु राम्रो होइन। मीठा कुरा सीमित मात्रामा खानु स्वास्थ्यकर हुन्छ।",
  "साँचो मान्छे सधैं सत्य बोल्छ र कसैलाई धोका दिदैन। इमानदारी जीवनको सबभन्दा ठूलो गुण हो।",
  "मेरो मनपर्ने विषय विज्ञान हो किनकि यसले संसार बुझ्न मद्दत गर्छ। म नयाँ प्रयोगहरू गर्न रुचाउँछु।",
  "हामीले एकअर्काको सम्मान गर्नुपर्छ। समाजमा शान्ति र सहयोगको भावना यसैबाट टिक्छ।",
  "म पढाइमा ध्यान दिन्छु र समयको सदुपयोग गर्न खोज्छु। म लक्ष्य हासिल गर्न योजनाबद्ध बन्छु।",
  "अहिले बिहानको १० बजे भयो र म टाइपिङ अभ्यास गर्दैछु। आज म आफ्नो गति परीक्षण पनि गर्न चाहन्छु।",
  "उनीले राम्ररी लेख्न जान्दछन् र सुन्दर हस्ताक्षर पनि गर्छन्। उनको लेखाइ देख्दा सबै प्रभावित हुन्छन्।",
  "यो वाक्यमा सबै वर्ण प्रयोग गरिएको छ ताकि म सबै अक्षरहरूमा अभ्यस्त बनूँ। टाइपिङ सीप सुधार गर्न यस्तो अभ्यास उपयोगी हुन्छ।",
  "ज्ञानेन्द्र राजा थिए र इतिहासमा नेपालको महत्वपूर्ण अध्याय बने। हामीले इतिहास बुझ्न र त्यसबाट सिक्नुपर्छ।",
  "त्रिभुवन विमानस्थलमा धेरै विमान छन् र यात्रुहरू व्यस्त देखिन्छन्। प्रत्येक देशका मानिसहरू यहाँ आउँछन्।",
  "शक्ति, भक्त, र भक्तजन एउटै शब्द परिवारका हुन् जसले संस्कृतको गहिराइ देखाउँछ। यस्तो शब्दहरूले हाम्रो भाषा समृद्ध बनाउँछन्।",
  "म एउटा कठिन परीक्षा दिँदैछु र तयारी राम्रोसँग गरेको छु। आत्मविश्वासले मलाई सफल बनाउनेछ।",
  "कृपया ढोका बन्द गर्नुहोस् र बत्ती निभाउनुहोस्। सरसफाइ र ऊर्जा बचत दुवै महत्त्वपूर्ण कुरा हुन्।",
  "संस्कृत शब्दहरू कठिन तर रोचक हुन्छन्। तिनले नेपाली भाषालाई गहिरो अर्थ र सुन्दरता दिन्छन्।",
  "श्री गणेशाय नमः। सबै कार्य आरम्भ गर्नुपूर्व गणेशको पूजा गर्ने परम्परा छ।",
  "मेरो नाम रमेश हो। म काठमाडौँमा बस्छु र टाइपिङ्गमा सुधार गर्दैछु। आज मौसम निकै सुन्दर छ र मलाई अभ्यास गर्न उत्साह लागेको छ।",
  "नेपालको राजधानी काठमाडौँ हो। यहाँ धेरै ऐतिहासिक स्थलहरू छन् र म हरेक दिन टाइपिङ्ग अभ्यास गर्छु। यसले मलाई दक्ष बनाउँछ।",
  "टाइपिङ्ग गति बढाउन नियमित अभ्यास आवश्यक छ। तपाईंले सही तरिकाले टाइप गर्नुपर्छ र अनुशासन पालन गर्नुपर्छ।",
  "म नेपाली भाषा सिक्दैछु र टाइपिङ्गमा सुधार गर्दैछु। यो मेरो लागि रमाइलो र उपयोगी अनुभव हो।",
  "टाइपिङ्ग गति बढाउन नियमित अभ्यास आवश्यक छ। तपाईंले सही तरिकाले टाइप गर्नुपर्छ र आत्मविश्वास बढाउनुपर्छ। मलाई नेपाली भाषा पढ्न र लेख्न मन पर्छ।",
  "नेपाल पर्वत र नदीहरूले भरिएको देश हो। यहाँका मानिसहरू मेहनती र इमानदार छन्। हामीले हाम्रो मातृभूमिको सम्मान गर्नुपर्छ।",
  "मलाई नेपाली भाषा पढ्न र लेख्न मन पर्छ। यसले मलाई मेरो संस्कृतिसँग जोडिएको महसुस गराउँछ।",
  "हामी सबैले हाम्रो मातृभाषा प्रति गर्व गर्नुपर्छ। मातृभाषा हाम्रो पहिचान हो र त्यसको संरक्षण हाम्रो जिम्मेवारी हो।",
];

interface TestRecord {
  wpm: number;
  accuracy: number;
  duration: number;
  date: string;
}

interface StorageData {
  "15": TestRecord[];
  "30": TestRecord[];
  "60": TestRecord[];
  "0": TestRecord[];
  [key: string]: TestRecord[]; // Add index signature
}

interface SaveResult {
  saved: boolean;
  reason: "first" | "better" | "not-better";
  previous?: TestRecord;
}

interface LeaderboardData {
  best: number;
  avgWpm: number;
  avgAcc: number;
  total: number;
  records: TestRecord[];
}

type DurationKey = "15" | "30" | "60" | "0";

const NepaliTypingTest: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [selectedTime, setSelectedTime] = useState<number>(60);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testFinished, setTestFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [target, setTarget] = useState<string>("");
  const [graphemes, setGraphemes] = useState<string[]>([]);
  const [typedGraphemes, setTypedGraphemes] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalTyped, setTotalTyped] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [customText, setCustomText] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<DurationKey>("60");
  const [toastMsg, setToastMsg] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [leaderboardKey, setLeaderboardKey] = useState<number>(0);

  // --- START: --- Fix States
  const [isClient, setIsClient] = useState(false); // For hydration fix
  const [testOver, setTestOver] = useState(false); // Triggers finalization
  const [leaderData, setLeaderData] = useState<LeaderboardData>({
    best: 0,
    avgWpm: 0,
    avgAcc: 0,
    total: 0,
    records: [],
  });
  // --- END: --- Fix States

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const segmenter =
    typeof Intl !== "undefined" && (Intl as any).Segmenter
      ? new (Intl as any).Segmenter("ne", { granularity: "grapheme" })
      : null;

  const splitGraphemes = (str: string): string[] => {
    if (!str) return [];
    if (segmenter) {
      const out: string[] = [];
      for (const s of segmenter.segment(str)) {
        out.push(s.segment);
      }
      return out;
    }
    return Array.from(str);
  };

  const displayToast = (msg: string): void => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // This function is safe, it's only called by effects on the client
  const loadAll = (): StorageData => {
    if (typeof window === "undefined") {
      return { "15": [], "30": [], "60": [], "0": [] };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const init: StorageData = { "15": [], "30": [], "60": [], "0": [] };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
        return init;
      }
      return JSON.parse(raw) as StorageData;
    } catch (e) {
      const init: StorageData = { "15": [], "30": [], "60": [], "0": [] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      return init;
    }
  };

  // This function is safe, it's only called by effects on the client
  const saveBestIfBetter = (key: string, rec: TestRecord): SaveResult => {
    if (typeof window === "undefined") {
      return { saved: false, reason: "not-better" };
    }
    const all = loadAll();
    const arr = all[key as DurationKey] || [];
    if (arr.length === 0) {
      all[key as DurationKey] = [rec];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return { saved: true, reason: "first" };
    }
    const best = arr[0];
    if (
      rec.wpm > best.wpm ||
      (rec.wpm === best.wpm && rec.accuracy > best.accuracy)
    ) {
      all[key as DurationKey] = [rec];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return { saved: true, reason: "better", previous: best };
    }
    return { saved: false, reason: "not-better", previous: best };
  };

  // This function is safe, it's only called by effects on the client
  const getLeaderboardData = (key: DurationKey): LeaderboardData => {
    const all = loadAll();
    const arr = (all[key] || [])
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (arr.length === 0) {
      return { best: 0, avgWpm: 0, avgAcc: 0, total: 0, records: [] };
    }

    const best = arr.reduce((m, r) => (r.wpm > m ? r.wpm : m), 0);
    const avgWpm = Math.round(arr.reduce((s, r) => s + r.wpm, 0) / arr.length);
    const avgAcc = Math.round(
      arr.reduce((s, r) => s + r.accuracy, 0) / arr.length
    );

    return { best, avgWpm, avgAcc, total: arr.length, records: arr };
  };

  // --- REMOVED: --- finalize function

  const startTest = (sec: number): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    setInputValue("");
    setTestStarted(false);
    setTestFinished(false);
    setTestOver(false); // --- ADDED: --- Reset test over flag
    setStartTime(null);
    setTypedGraphemes([]);
    setCorrectCount(0);
    setTotalTyped(0);
    setWpm(0);
    setAccuracy(0);
    setSelectedTime(sec);
    setTimeLimit(sec);

    const custom =
      customText && customText.trim().length > 0
        ? customText.trim()
        : samples[Math.floor(Math.random() * samples.length)];

    setTarget(custom);
    const newGraphemes = splitGraphemes(custom);
    setGraphemes(newGraphemes);

    if (inputRef.current) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (testFinished) return;

    const value = e.target.value;
    setInputValue(value);

    if (!testStarted) {
      setTestStarted(true);
      setStartTime(Date.now());
      setTestOver(false); // --- ADDED: --- Reset flag
      // --- REMOVED: --- All timer logic from here
    }

    const typed = splitGraphemes(value);
    setTypedGraphemes(typed);
    setTotalTyped(typed.length);

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (i >= graphemes.length) break;
      if (typed[i] === graphemes[i]) correct++;
      else break;
    }
    setCorrectCount(correct);

    const elapsed = startTime
      ? Math.max((Date.now() - startTime) / 1000, 0)
      : 0;
    const mins = Math.max(elapsed / 60, 1 / 60);
    const currentWpm = correct / 5 / mins;
    const currentAcc = typed.length > 0 ? (correct / typed.length) * 100 : 0;

    setWpm(Math.round(currentWpm || 0));
    setAccuracy(Math.round(currentAcc || 0));

    if (selectedTime === 0 && typed.length >= graphemes.length) {
      // --- MODIFIED: --- Trigger finalize via effect
      setTestOver(true);
      setTestFinished(true); // Lock input immediately
    }
  };

  const handleTimeSelect = (sec: number): void => {
    setSelectedTime(sec);
    setTimeLimit(sec);
  };

  const clearDuration = (): void => {
    if (typeof window === "undefined") return;
    if (!window.confirm("Clear saved best for this duration?")) return;
    const all = loadAll();
    all[currentTab] = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    displayToast("✅ Cleared duration leaderboard");
    setLeaderboardKey((prev) => prev + 1);
  };

  const clearAll = (): void => {
    if (typeof window === "undefined") return;
    if (!window.confirm("Clear ALL saved bests?")) return;
    const init: StorageData = { "15": [], "30": [], "60": [], "0": [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
    displayToast("✅ All leaderboards cleared");
    setLeaderboardKey((prev) => prev + 1);
  };

  // --- ADDED: --- Effect to load theme, text, and set client flag
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") setTheme("dark");

    const defaultText = samples[Math.floor(Math.random() * samples.length)];
    setTarget(defaultText);
    setGraphemes(splitGraphemes(defaultText));

    setIsClient(true); // Mark as mounted on client
  }, []);

  // --- ADDED: --- Effect to load leaderboard data *after* mount
  useEffect(() => {
    if (isClient) {
      setLeaderData(getLeaderboardData(currentTab));
    }
  }, [isClient, currentTab, leaderboardKey]); // getLeaderboardData is stable

  // --- ADDED: --- Effect to handle the timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (testStarted && selectedTime > 0) {
      const testEndTime = (startTime || Date.now()) + selectedTime * 1000;

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const remainingSeconds = Math.max(
          0,
          Math.round((testEndTime - now) / 1000)
        );

        setTimeLimit(remainingSeconds);

        if (remainingSeconds <= 0) {
          clearInterval(timerRef.current!);
          setTestOver(true); // Trigger finalize effect
          setTestFinished(true); // Lock input
        }
      }, 500); // Check every half second
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted, selectedTime, startTime]);

  // --- ADDED: --- Effect to run finalize logic when test is over
  useEffect(() => {
    if (testOver) {
      // This logic now runs with FRESH state
      const elapsed = startTime
        ? Math.max((Date.now() - startTime) / 1000, 0)
        : 0;
      const mins = Math.max(elapsed / 60, 1 / 60);
      const finalWpm = correctCount / 5 / mins;
      const finalAcc = totalTyped > 0 ? (correctCount / totalTyped) * 100 : 0;

      const rec: TestRecord = {
        wpm: Math.round(finalWpm || 0),
        accuracy: Math.round(finalAcc || 0),
        duration: Math.round(elapsed),
        date: new Date().toISOString(),
      };

      const result = saveBestIfBetter(String(selectedTime), rec);
      if (result.saved) {
        if (result.reason === "first") {
          displayToast(
            `✅ First result saved to leaderboard! ${rec.wpm} WPM, ${rec.accuracy}% accuracy`
          );
        } else {
          displayToast(
            `🎉 New best saved to leaderboard! ${rec.wpm} WPM (previous: ${result.previous?.wpm} WPM)`
          );
        }
      } else if (result.previous) {
        displayToast(
          `📊 Test complete: ${rec.wpm} WPM, ${rec.accuracy}% accuracy. Your best is still ${result.previous.wpm} WPM`
        );
      } else {
        displayToast(
          `📊 Test complete: ${rec.wpm} WPM, ${rec.accuracy}% accuracy.`
        );
      }
      setLeaderboardKey((prev) => prev + 1);
    }
  }, [testOver]); // This is the trigger

  // --- REMOVED: --- Old useEffect for timer cleanup (merged)
  // --- REMOVED: --- Old useEffect for theme/text (merged)

  const toggleTheme = (): void => {
    if (typeof window === "undefined") return;
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  const progress =
    selectedTime > 0 ? Math.max(0, (timeLimit / selectedTime) * 100) : 100;

  // --- REMOVED: --- useMemo for leaderData (it's state now)

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark bg-gray-950" : "bg-gray-50"
      }`}
    >
      <div className="max-w-5xl mx-auto p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center my-8">
          <div className="flex gap-3 items-center">
            <div className="p-2 border border-black rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center font-bold text-blue-600 shadow-lg">
              गौरव
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                नेपाली टाइपिङ परीक्षण
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gaurav Khanal ( khanalgaurav0@gmail.com )
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              disabled={!isClient} // Disable until mounted
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 mr-2" /> Light
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" /> Dark
                </>
              )}
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" disabled={!isClient}>
                  {" "}
                  {/* Disable until mounted */}
                  <Trophy className="w-4 h-4 mr-2" /> Leaderboard
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800">
                <DialogHeader>
                  <DialogTitle className="dark:text-gray-100">
                    Leaderboard — per duration (best only)
                  </DialogTitle>
                </DialogHeader>

                <Tabs
                  value={currentTab}
                  onValueChange={(val) => setCurrentTab(val as DurationKey)}
                >
                  <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
                    <TabsTrigger
                      value="15"
                      className="dark:data-[state=active]:bg-gray-700"
                    >
                      15s
                    </TabsTrigger>
                    <TabsTrigger
                      value="30"
                      className="dark:data-[state=active]:bg-gray-700"
                    >
                      30s
                    </TabsTrigger>
                    <TabsTrigger
                      value="60"
                      className="dark:data-[state=active]:bg-gray-700"
                    >
                      60s
                    </TabsTrigger>
                    <TabsTrigger
                      value="0"
                      className="dark:data-[state=active]:bg-gray-700"
                    >
                      Unlimited
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex gap-4 flex-wrap my-4 text-sm dark:text-gray-300">
                    <div>
                      🏆 Best WPM:{" "}
                      <strong className="dark:text-gray-100">
                        {leaderData.best || "—"}
                      </strong>
                    </div>
                    <div>
                      📊 Avg WPM:{" "}
                      <strong className="dark:text-gray-100">
                        {leaderData.avgWpm || "—"}
                      </strong>
                    </div>
                    <div>
                      🎯 Avg Acc:{" "}
                      <strong className="dark:text-gray-100">
                        {leaderData.avgAcc ? `${leaderData.avgAcc}%` : "—"}
                      </strong>
                    </div>
                    <div>
                      🧾 Total:{" "}
                      <strong className="dark:text-gray-100">
                        {leaderData.total}
                      </strong>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDuration}
                        className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                      >
                        Clear This
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                        className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-auto">
                    <table className="w-full">
                      <thead className="border-b dark:border-gray-700">
                        <tr>
                          <th className="text-center p-2 dark:text-gray-300">
                            S.N.
                          </th>
                          <th className="text-center p-2 dark:text-gray-300">
                            Date
                          </th>
                          <th className="text-center p-2 dark:text-gray-300">
                            WPM
                          </th>
                          <th className="text-center p-2 dark:text-gray-300">
                            Accuracy
                          </th>
                          <th className="text-center p-2 dark:text-gray-300">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderData.records.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center p-4 text-gray-500 dark:text-gray-400"
                            >
                              No saved best for this duration yet.
                            </td>
                          </tr>
                        ) : (
                          leaderData.records.map((rec, i) => (
                            <tr
                              key={rec.date} // Use date for a more stable key
                              className="border-b border-dashed dark:border-gray-800"
                            >
                              <td className="p-2 text-center dark:text-gray-300">
                                {i + 1}
                              </td>
                              <td className="p-2 text-center dark:text-gray-300">
                                {new Date(rec.date).toLocaleString()}
                              </td>
                              <td className="p-2 text-center dark:text-gray-300">
                                {rec.wpm}
                              </td>
                              <td className="p-2 text-center dark:text-gray-300">
                                {rec.accuracy}%
                              </td>
                              <td className="p-2 text-center dark:text-gray-300">
                                {rec.duration}s
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Time Selection */}
        <div className="flex justify-between items-center flex-wrap gap-2 mb-5">
          <div className="flex gap-2">
            {[15, 30, 60, 0].map((sec) => (
              <Button
                key={sec}
                variant={selectedTime === sec ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeSelect(sec)}
                className={
                  selectedTime !== sec
                    ? "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                    : ""
                }
              >
                {sec === 0 ? "Unlimited" : `${sec}s`}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Default: <strong>60s</strong> • Test starts when you type
          </p>
        </div>

        {/* Custom Text */}
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className=" space-y-2">
            <Textarea
              placeholder="(Optional) paste or type Nepali text here — short or long text is fine"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="min-h-20 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
            <div className="flex gap-2 justify-between items-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    if (!customText.trim()) {
                      displayToast("⚠️ Paste or type custom text first");
                      return;
                    }
                    displayToast(
                      "✅ Custom text set — press Restart to start with it"
                    );
                  }}
                >
                  Use
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCustomText("");
                    displayToast("✅ Custom cleared");
                  }}
                  className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                >
                  Clear
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Custom text will be used for the next test
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="flex gap-4 items-center flex-wrap text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time:{" "}
            <strong className="dark:text-gray-100">
              {timeLimit === 0 ? "∞" : timeLimit}s
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            WPM: <strong className="dark:text-gray-100">{wpm}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Accuracy:{" "}
            <strong className="dark:text-gray-100">{accuracy}%</strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tracking Card */}
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="py-2 min-h-[70px] max-h-[500px] overflow-auto">
            <div
              className="text-lg leading-relaxed select-none"
              style={{ fontFamily: "Kalimati, system-ui" }}
            >
              {graphemes.map((char, i) => {
                let className =
                  "inline-block whitespace-pre text-gray-500 dark:text-gray-400";
                const isTyped = i < typedGraphemes.length;
                const isCurrent = i === typedGraphemes.length;

                if (isTyped) {
                  if (typedGraphemes[i] === graphemes[i]) {
                    className =
                      "inline-block whitespace-pre text-green-600 dark:text-green-400";
                  } else {
                    className =
                      "inline-block whitespace-pre text-red-600 dark:text-red-400 underline decoration-wavy";
                  }
                }

                if (isCurrent) {
                  className += " relative";
                }

                return (
                  <span key={i} className={className}>
                    {char}
                    {isCurrent && (
                      <span className="absolute left-0 right-0 h-0.5 -bottom-1 bg-blue-600 animate-pulse" />
                    )}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Input Card */}
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="">
            <div className="flex gap-3 items-center">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInput}
                placeholder="यहाँ टाइप गर्न सुरु गर्नुहोस्..."
                className="flex-1 h-10 !text-lg px-4 dark:bg-gray-800 dark:border-gray-900 dark:text-gray-100"
                style={{ fontFamily: "Kalimati, system-ui" }}
                autoComplete="off"
                autoCorrect="off"
                disabled={testFinished}
              />
              <Button
                variant="outline"
                onClick={() => startTest(selectedTime)}
                className="h-10 px-6 text-lg dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              >
                Restart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md z-50">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default NepaliTypingTest;
