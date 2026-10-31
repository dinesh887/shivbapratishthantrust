export type Language = "mr" | "en";
export interface ImageContent { src: string; alt: string }
export interface AccordionContent { question: string; answers: string[] }
export interface SectionImage { src: string; alt: string }
export interface WinnerContent { position?: string; team: string; fort: string; image: SectionImage }
export interface SectionContent {
  top: { tagline:string; title:string; image:ImageContent; description:string; primaryButton:string; primaryHref:string; secondaryButton:string; secondaryHref:string; details:{label:string;value:string}[] };
  about: { eyebrow:string; title:string; paragraphs:string[] };
  join: { eyebrow:string; title:string; description:string; button:string; steps:{number:string;label:string;title:string;description:string;icon:string}[] };
  register: { eyebrow:string;title:string;description:string;requiredNote:string;secureNote:string;registrationTypes:{value:string;label:string}[];fields:Record<string,{label:string;placeholder:string;id:string;type:string;required:boolean}>;districtOptions:string[];districtSearchPlaceholder:string;districtNoResults:string;fortTypes:{value:string;label:string;description:string;icon:string}[];fortTypeLabel:string;mobileLengthNote:string;alternateNote:string;mobilePrefix:string;registrationTypeLabel:string;driveHint:string;consentPrefix:string;consentSuffix:string;rulesLink:string;submit:string };
  gallery: { eyebrow:string;title:string;subtitle:string;categories:{id:string;label:string}[];noResults:string;showMore:string;closePreview:string;previousImage:string;nextImage:string;items:{src:string;alt:string;category:string}[] };
  winners: { title:string;description:string;yearLabel:string;yearTabs:{value:string;label:string}[];years:Record<string,WinnerContent[]>;thankYou:string };
  rules:{eyebrow:string;title:string;description:string}; faq:{eyebrow:string;title:string};
  cta:{eyebrow:string;titleLines:string[];button:string;href:string};
}
export interface WebsiteLanguageContent {
 site:{title:string;description:string;favicon:string};
 layout:{header:{logo:ImageContent & {width:number;height:number};brand:string;navLabel:string;navigation:{href:string;label:string}[];action:{href:string;label:string}};footer:{logo:ImageContent & {width:number;height:number};brand:string;description:string[];contact:{label:string;lines:string[]};address:{label:string;lines:string[]};social:{instagram:{href:string;label:string}};copyright:string}};
 sections:SectionContent; accordions:{rules:AccordionContent[];faq:AccordionContent[]}; certificatePreview:Record<string,string>; messages:Record<string,string>; validationErrors:Record<string,string[]>; validationOptions:{districts:string[]}; languageSwitcher:{label:string;marathi:string;english:string};
}
export interface BilingualContent { mr:WebsiteLanguageContent; en:WebsiteLanguageContent }

export const content: BilingualContent = {
  "mr": {
    "site": {
      "title": "शिवबा प्रतिष्ठान – गडकोट बांधणी स्पर्धा",
      "description": "शिवबा प्रतिष्ठान गडकोट बांधणी स्पर्धा",
      "favicon": "/favicon.ico"
    },
    "layout": {
      "header": {
        "logo": {
          "src": "/images/trust-seal.png",
          "alt": "शिवबा प्रतिष्ठान ट्रस्ट लोगो",
          "width": 52,
          "height": 52
        },
        "brand": "शिवबा प्रतिष्ठान ट्रस्ट",
        "navLabel": "मुख्य",
        "navigation": [
          {
            "href": "#about",
            "label": "आमच्याबद्दल"
          },
          {
            "href": "#join",
            "label": "सहभाग"
          },
          {
            "href": "#gallery",
            "label": "गॅलरी"
          },
          {
            "href": "#rules",
            "label": "नियम"
          }
        ],
        "action": {
          "href": "#register",
          "label": "नोंदणी करा"
        }
      },
      "footer": {
        "logo": {
          "src": "/images/trust-seal.png",
          "alt": "शिवबा प्रतिष्ठान ट्रस्ट लोगो",
          "width": 80,
          "height": 80
        },
        "brand": "शिवबा प्रतिष्ठान ट्रस्ट",
        "description": [
          "सामाजिक कार्याशी कटिबध्द संस्था",
          "गडकोट बांधणी स्पर्धा २०२६"
        ],
        "contact": {
          "label": "संपर्क",
          "lines": [
            "9892435999",
            "9987393638",
            "shivbapratishthantrust@gmail.com"
          ]
        },
        "address": {
          "label": "पत्ता",
          "lines": [
            "शिवबा प्रतिष्ठान ट्रस्ट ऑफिस, विघ्नेश्वर 2 बी,",
            "छत्रपती संभाजी महाराज नगर, डी मार्ट समोर,",
            "कोलडोंगरी, सहार रोड, अंधेरी पूर्व, मुंबई ६९"
          ]
        },
        "social": {
          "instagram": {
            "href": "https://www.instagram.com/__shivbapratishthantrust/",
            "label": "इन्स्टाग्रामवर आम्हाला फॉलो करा"
          }
        },
        "copyright": "© २०२६ शिवबा प्रतिष्ठान ट्रस्ट"
      }
    },
    "sections": {
      "top": {
        "tagline": "शिवबा प्रतिष्ठान ट्रस्ट सादर करत आहे",
        "title": "जगातील पहिली आंतरराष्ट्रीय गड किल्ले बांधणी स्पर्धा 2026",
        "image": {
          "src": "/images/shivba-wordmark.png",
          "alt": "जगातील पहिली आंतरराष्ट्रीय गड किल्ले बांधणी स्पर्धा 2026"
        },
        "description": "दिवाळीच्या मातीतून उभे राहणारे आपले गड-किल्ले. आपल्या इतिहासाला हातांनी आकार द्या.",
        "primaryButton": "आत्ताच नोंदणी करा",
        "primaryHref": "#register",
        "secondaryButton": "सहभाग कसा घ्यावा",
        "secondaryHref": "#join",
        "details": [
          {
            "label": "अंतिम तारीख",
            "value": "२१ नोव्हेंबर २०२६"
          },
          {
            "label": "शुल्क",
            "value": "विनामूल्य"
          }
        ]
      },
      "about": {
        "eyebrow": "आमच्याबद्दल",
        "title": "शिवबा प्रतिष्ठान ट्रस्ट",
        "paragraphs": [
          "शिवबा प्रतिष्ठान ट्रस्ट ही सामाजिक कार्याशी कटिबद्ध संस्था असून छत्रपती शिवाजी महाराजांच्या विचारांचा वारसा जपणारी संस्था आहे. संस्थेने २०१६ पासून सामाजिक कार्याच्या माध्यमातून समाजहितासाठी विविध उपक्रम राबवण्यास सुरुवात केली.",
          "गडकोट बांधणी स्पर्धेतून नवीन पिढीला गड-किल्ल्यांचा इतिहास, स्थापत्य आणि अभिमान जवळून अनुभवता यावा, हा आमचा उद्देश आहे."
        ]
      },
      "join": {
        "eyebrow": "सहभाग",
        "title": "सहभाग कसा घ्यावा",
        "description": "गडाच्या पायथ्यापासून शिखरापर्यंत, फक्त चार सोप्या पायऱ्या.",
        "steps": [
          {
            "number": "१",
            "label": "पायरी १",
            "title": "नोंदणी करा",
            "description": "वर दिलेला फॉर्म भरून आपले नाव, गाव आणि गट नोंदवा.",
            "icon": "registration"
          },
          {
            "number": "२",
            "label": "पायरी २",
            "title": "गड निवडा",
            "description": "प्रतिकृती बनवण्यासाठी आपला आवडता गड किंवा किल्ला निवडा.",
            "icon": "fort"
          },
          {
            "number": "३",
            "label": "पायरी ३",
            "title": "प्रतिकृती बनवा",
            "description": "माती, दगड आणि नैसर्गिक साहित्याने आपला गड साकारा.",
            "icon": "model"
          },
          {
            "number": "४",
            "label": "पायरी ४",
            "title": "फोटो सादर करा",
            "description": "पूर्ण झालेल्या गडाचे फोटो २१ नोव्हेंबर २०२६ पर्यंत आमच्याकडे पाठवा.",
            "icon": "photo"
          }
        ],
        "button": "आत्ताच नोंदणी करा"
      },
      "register": {
        "eyebrow": "नोंदणी",
        "title": "आपला सहभाग नोंदवा",
        "description": "खालील माहिती भरून नोंदणी पूर्ण करा. सर्व माहिती योग्यरीत्या भरावी. नोंदणी पूर्ण झाल्यानंतर पुढील प्रक्रियेची माहिती आयोजकांकडून कळवली जाईल.",
        "requiredNote": "पर्यायी (ऐच्छिक) म्हणून नमूद केलेली माहिती वगळता सर्व माहिती आवश्यक आहे.",
        "secureNote": "आपली माहिती सुरक्षित आहे.",
        "registrationTypes": [
          {
            "value": "individual",
            "label": "वैयक्तिक"
          },
          {
            "value": "group",
            "label": "समूह"
          }
        ],
        "fields": {
          "name": {
            "label": "सहभागी / समूहाचे नाव",
            "placeholder": "उदा. रोहन पाटील",
            "id": "rn",
            "type": "text",
            "required": true
          },
          "district": {
            "label": "जिल्हा / परिसर",
            "placeholder": "आपले ठिकाण निवडा",
            "id": "rd",
            "type": "select",
            "required": true
          },
          "mobile": {
            "label": "संपर्क क्रमांक",
            "placeholder": "98765 43210",
            "id": "rc",
            "type": "tel",
            "required": true
          },
          "alternateMobile": {
            "label": "पर्यायी क्रमांक",
            "placeholder": "98765 43210",
            "id": "ra",
            "type": "tel",
            "required": false
          },
          "email": {
            "label": "ईमेल पत्ता",
            "placeholder": "you@example.com",
            "id": "re",
            "type": "email",
            "required": true
          },
          "fortName": {
            "label": "आपण बनवत असलेला गड",
            "placeholder": "उदा. सिंधुदुर्ग",
            "id": "rf",
            "type": "text",
            "required": true
          },
          "driveFolderUrl": {
            "label": "फोटो / व्हिडिओ Google Drive लिंक",
            "placeholder": "https://drive.google.com/drive/folders/...",
            "id": "rg",
            "type": "url",
            "required": true
          }
        },
        "districtOptions": [
          "अहिल्यानगर",
          "अकोला",
          "अमरावती",
          "बीड",
          "भंडारा",
          "बुलढाणा",
          "चंद्रपूर",
          "छत्रपती संभाजीनगर",
          "धाराशिव",
          "धुळे",
          "गडचिरोली",
          "गोंदिया",
          "हिंगोली",
          "जळगाव",
          "जालना",
          "कोल्हापूर",
          "लातूर",
          "मुंबई शहर",
          "मुंबई उपनगर",
          "नागपूर",
          "नांदेड",
          "नंदुरबार",
          "नाशिक",
          "पालघर",
          "परभणी",
          "पुणे",
          "रायगड",
          "रत्नागिरी",
          "सांगली",
          "सातारा",
          "सिंधुदुर्ग",
          "सोलापूर",
          "ठाणे",
          "वर्धा",
          "वाशिम",
          "यवतमाळ",
          "इतर"
        ],
        "districtSearchPlaceholder": "जिल्हा शोधा...",
        "districtNoResults": "जुळणारा जिल्हा सापडला नाही.",
        "fortTypes": [
          {
            "value": "giri",
            "label": "गिरिदुर्ग",
            "description": "डोंगरी किल्ला",
            "icon": "mountain"
          },
          {
            "value": "jala",
            "label": "जलदुर्ग",
            "description": "सागरी / जल किल्ला",
            "icon": "water"
          },
          {
            "value": "bhui",
            "label": "भुईकोट",
            "description": "सपाट जमिनीवरील किल्ला",
            "icon": "fort"
          },
          {
            "value": "vana",
            "label": "वनदुर्ग",
            "description": "जंगलातील किल्ला",
            "icon": "tree"
          }
        ],
        "fortTypeLabel": "गडाचा प्रकार",
        "mobileLengthNote": "(१० अंकी)",
        "alternateNote": "(ऐच्छिक)",
        "driveHint": "फोटो व व्हिडिओ एकाच फोल्डरमध्ये ठेवा आणि परवानगी 'Anyone with the link can view' अशी सेट करा.",
        "rulesLink": "नियम",
        "submit": "नोंदणी पूर्ण करा",
        "consentPrefix": "मी दिलेली सर्व माहिती खरी असल्याचे प्रमाणित करतो/करते आणि स्पर्धेचे",
        "consentSuffix": "मान्य आहेत.",
        "registrationTypeLabel": "नोंदणीचा प्रकार",
        "mobilePrefix": "+91"
      },
      "gallery": {
        "eyebrow": "गॅलरी",
        "title": "शिवबा प्रतिष्ठान ट्रस्ट – छायाचित्र संग्रह",
        "subtitle": "सामाजिक कार्य, विविध उपक्रम आणि कार्यक्रमांच्या आठवणींना उजाळा देणारा छायाचित्र संग्रह.",
        "categories": [{"id":"all","label":"सर्व"},{"id":"forts","label":"गडकोट"},{"id":"social","label":"सामाजिक कार्यक्रम"}],
        "noResults": "या विभागात सध्या छायाचित्रे उपलब्ध नाहीत.",
        "showMore": "आणखी फोटो पहा",
        "closePreview": "प्रतिमा पूर्वदृश्य बंद करा",
        "previousImage": "मागील प्रतिमा",
        "nextImage": "पुढील प्रतिमा",
        "items": [          {
            "src": "/gallery/%E0%A4%B6%E0%A4%BF%E0%A4%B5%E0%A4%B0%E0%A4%BE%E0%A4%AF%20%E0%A4%85%E0%A4%B8%E0%A5%87%20%E0%A4%B6%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%BF%E0%A4%A6%E0%A4%BE%E0%A4%A4%E0%A4%BE....%20(2).jpg",
            "alt": "शिवजयंती कार्यक्रमातील रंगमंचावरील सादरीकरण",
            "category": "social"
          },
          {
            "src": "/gallery/shiv-jayanti-greetings.jpg",
            "alt": "शिवबा प्रतिष्ठान ट्रस्टच्या शिवजयंती शुभेच्छा आणि सत्कार समारंभाचे पोस्टर",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-06.jpg",
            "alt": "२०१९ च्या पुरग्रस्तांसाठी मदत व सेवा उपक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-05.jpg",
            "alt": "२०१९ च्या पुरग्रस्तांसाठी मदत व सेवा उपक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-04.jpg",
            "alt": "२०१९ च्या पुरग्रस्तांसाठी मदत व सेवा उपक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-02.jpg",
            "alt": "२०१९ च्या पुरग्रस्तांसाठी मदत व सेवा उपक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-03.jpg",
            "alt": "२०१९ च्या पुरग्रस्तांसाठी मदत व सेवा उपक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-01.jpg",
            "alt": "२०१९ च्या पुरग्रस्तांसाठी मदत व सेवा उपक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/shivprerna-jyot-04.jpg",
            "alt": "शिवजयंतीनिमित्त शिवप्रेरणा ज्योत कार्यक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/shivprerna-jyot-03.jpg",
            "alt": "शिवजयंतीनिमित्त शिवप्रेरणा ज्योत कार्यक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/shivprerna-jyot-02.jpg",
            "alt": "शिवजयंतीनिमित्त शिवप्रेरणा ज्योत कार्यक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/shivprerna-jyot-01.jpg",
            "alt": "शिवजयंतीनिमित्त शिवप्रेरणा ज्योत कार्यक्रमातील दृश्य",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-05.jpg",
            "alt": "शिवबा प्रतिष्ठान ट्रस्टतर्फे छत्रपती संभाजी महाराज नगर व्हॉलीबॉल संघाला टी-शर्टचे वाटप",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-04.jpg",
            "alt": "शिवबा प्रतिष्ठान ट्रस्टतर्फे छत्रपती संभाजी महाराज नगर व्हॉलीबॉल संघाला टी-शर्टचे वाटप",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-03.jpg",
            "alt": "शिवबा प्रतिष्ठान ट्रस्टतर्फे छत्रपती संभाजी महाराज नगर व्हॉलीबॉल संघाला टी-शर्टचे वाटप",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-02.jpg",
            "alt": "शिवबा प्रतिष्ठान ट्रस्टतर्फे छत्रपती संभाजी महाराज नगर व्हॉलीबॉल संघाला टी-शर्टचे वाटप",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-01.jpg",
            "alt": "शिवबा प्रतिष्ठान ट्रस्टतर्फे छत्रपती संभाजी महाराज नगर व्हॉलीबॉल संघाला टी-शर्टचे वाटप",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-parle-third-place.jpg",
            "alt": "पार्ले महोत्सवात तिसरा क्रमांक मिळवलेल्या छत्रपती संभाजी महाराज नगर व्हॉलीबॉल संघाचे अभिनंदन करणारे पोस्टर",
            "category": "social"
          },

          {
            "src": "/gallery/gallery1.jpg",
            "alt": "गडाच्या प्रतिकृतीसमोर उभा असलेला सहभागींचा गट",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery3.jpeg",
            "alt": "रंगीबेरंगी सजावट असलेली गडाची प्रतिकृती",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery4.jpg",
            "alt": "पाण्याने वेढलेल्या जलदुर्गाची प्रतिकृती",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery5.jpg",
            "alt": "गडाच्या प्रतिकृतीभोवती उभे असलेले सहभागी",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery6.jpg",
            "alt": "किल्ले पुरंदरच्या प्रतिकृतीचे दृश्य",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery7.webp",
            "alt": "समुद्रकिनारी किल्ल्याच्या प्रतिकृतीचे विस्तृत दृश्य",
            "category": "forts"
          },
          {
            "src": "/gallery/raigad-new-year-honors-01.jpg",
            "alt": "रायगडावर पुरस्कार व सन्मानपत्र स्वीकारतानाचा सोहळा",
            "category": "social"
          },
          {
            "src": "/gallery/raigad-new-year-honors-02.jpg",
            "alt": "रायगडावरील सन्मान सोहळ्यात सहभागी झालेले शिवभक्त",
            "category": "social"
          },
          {
            "src": "/gallery/raigad-new-year-honors-03.jpg",
            "alt": "रायगडावरील पुरस्कार वितरण सोहळा",
            "category": "social"
          }
        ]
      },
      "winners": {
        "title": "स्पर्धेचे मानकरी",
        "description": "गड-किल्ला स्पर्धेतील उत्कृष्ट कामगिरी करणाऱ्या विजेत्यांचा गौरव.",
        "yearTabs": [
          {
            "value": "25",
            "label": "२०२५"
          },
          {
            "value": "24",
            "label": "२०२४"
          }
        ],
        "years": {
          "0": [
            {
              "team": "विजेता गटाचे नाव",
              "fort": "[गडाचे नाव]",
              "image": {
                "src": "",
                "alt": "[गडाचे फोटो]"
              }
            },
            {
              "team": "विजेता गटाचे नाव",
              "fort": "[गडाचे नाव]",
              "image": {
                "src": "",
                "alt": "[गडाचे फोटो]"
              }
            },
            {
              "team": "विजेता गटाचे नाव",
              "fort": "[गडाचे नाव]",
              "image": {
                "src": "",
                "alt": "[गडाचे फोटो]"
              }
            }
          ],
          "24": [
            {
              "position": "द्वितीय पारितोषिक",
              "team": "विश्वकर्मा नवतरुण मित्रा मंडळ, सातारा",
              "fort": "",
              "image": {
                "src": "/images/winner-2.jpg",
                "alt": "२०२४ द्वितीय पारितोषिक – विश्वकर्मा नवतरुण मित्रा मंडळ, सातारा"
              }
            },
            {
              "position": "प्रथम पारितोषिक",
              "team": "शिवसंकल्प मित्र समूह, सातारा",
              "fort": "",
              "image": {
                "src": "/images/winner-1.jpg",
                "alt": "२०२४ प्रथम पारितोषिक – शिवसंकल्प मित्र समूह, सातारा"
              }
            },
            {
              "position": "तृतीय पारितोषिक",
              "team": "विजेता क्रीडा मंडळ, कोल्हापूर",
              "fort": "",
              "image": {
                "src": "/images/winner-3.jpg",
                "alt": "२०२४ तृतीय पारितोषिक – विजेता क्रीडा मंडळ, कोल्हापूर"
              }
            }
          ],
          "2": [
            {
              "team": "विजेता गटाचे नाव",
              "fort": "[गडाचे नाव]",
              "image": {
                "src": "",
                "alt": "[गडाचे फोटो]"
              }
            },
            {
              "team": "विजेता गटाचे नाव",
              "fort": "[गडाचे नाव]",
              "image": {
                "src": "",
                "alt": "[गडाचे फोटो]"
              }
            },
            {
              "team": "विजेता गटाचे नाव",
              "fort": "[गडाचे नाव]",
              "image": {
                "src": "",
                "alt": "[गडाचे फोटो]"
              }
            }
          ],
          "25": [
            {
              "position": "द्वितीय पारितोषिक",
              "team": "धर्मवीर प्रतिष्ठान, सातारा",
              "fort": "किल्ले अजिंक्यतारा",
              "image": {
                "src": "/images/second-place-photo.jpg",
                "alt": "२०२५ द्वितीय पारितोषिक – धर्मवीर प्रतिष्ठान, सातारा"
              }
            },
            {
              "position": "प्रथम पारितोषिक",
              "team": "ओमकार मित्र मंडळ, ठाणे",
              "fort": "जंजिरा व पद्मदुर्ग",
              "image": {
                "src": "/images/first-place-photo.jpg",
                "alt": "२०२५ प्रथम पारितोषिक – ओमकार मित्र मंडळ, ठाणे"
              }
            },
            {
              "position": "तृतीय पारितोषिक",
              "team": "आझाद स्पोर्ट्स क्लब, भांडुप",
              "fort": "किल्ले जिंजी",
              "image": {
                "src": "/images/third-place-photo.jpg",
                "alt": "२०२५ तृतीय पारितोषिक – आझाद स्पोर्ट्स क्लब, भांडुप"
              }
            }
          ]
        },
        "thankYou": "या स्पर्धेत सहभाग घेतलेल्या सर्व स्पर्धकांचे आम्ही मनःपूर्वक आभार मानतो.",
        "yearLabel": "वर्ष"
      },
      "rules": {
        "eyebrow": "नियम व अटी",
        "title": "स्पर्धेचे नियम व अटी",
        "description": "सहभागींसाठी खालील नियम व अटी वाचून समजून घ्याव्यात. सर्व नियमांचे पालन करणे आवश्यक आहे."
      },
      "faq": {
        "eyebrow": "सतत विचारले जाणारे प्रश्न",
        "title": "वारंवार विचारले जाणारे प्रश्न"
      },
      "cta": {
        "eyebrow": "शिवबा प्रतिष्ठान ट्रस्ट",
        "button": "स्पर्धेत सहभागी व्हा",
        "href": "#register",
        "titleLines": [
          "गड-किल्ल्यांचा वारसा जपूया,",
          "पुढील पिढीपर्यंत पोहोचवूया."
        ]
      }
    },
    "accordions": {
      "rules": [
        {
          "question": "स्पर्धेचे नियम",
          "answers": [
            "ही स्पर्धा ऑनलाईन पद्धतीत होणार आहे.",
            "गड किल्ला हा २०२६ सालाचा असावा.",
            "किल्ल्याच्या माहिती बरोबर 2 मिनिटांचा चित्रफीत (video) पाठवावा.",
            "किल्ल्याचे 2 ते 3 छायाचित्र (फोटो) पाठवावेत.",
            "स्पर्धकांना गुगल फॉर्म भरणे अनिवार्य आहे.",
            "चित्रफिती मध्ये किल्ल्याची माहिती असल्यास प्राधान्य.",
            "सादर किल्ल्याचा चित्रफीत (video) शिवबा प्रतिष्ठान ट्रस्टच्या इन्स्टाग्राम प्रोफाइल ला कोलॅबरेट करावे.",
            "चित्रफीत (video) व छायाचित्र पाठवण्याची अंतिम तारीख: २१ नोव्हेंबर २०२६"
          ]
        },
        {
          "question": "पात्रता",
          "answers": [
            "ही स्पर्धा सर्वांसाठी खुली आहे. गड-किल्ल्यांची आवड असलेल्या सर्व व्यक्ती आणि समूह यात सहभागी होऊ शकतात."
          ]
        },
        {
          "question": "सहभागाची प्रक्रिया",
          "answers": [
            "नोंदणी फॉर्म पूर्ण भरून सादर करावा.",
            "एका गडासाठी एकच नोंदणी ग्राह्य धरली जाईल.",
            "प्रतिकृती स्वतः बनवलेली आणि मूळ असावी.",
            "माती, दगड, लाकूड यांसारखे नैसर्गिक साहित्य वापरावे."
          ]
        },
        {
          "question": "फोटो / व्हिडिओ सबमिशन",
          "answers": [
            "पूर्ण झालेल्या गडाचे फोटो २१ नोव्हेंबर २०२६ पर्यंत सादर करणे आवश्यक आहे.",
            "फोटो व व्हिडिओ एकाच Google Drive फोल्डरमध्ये ठेवावेत.",
            "फोल्डरची परवानगी 'Anyone with the link can view' अशी ठेवावी."
          ]
        },
        {
          "question": "महत्त्वाच्या सूचना",
          "answers": [
            "नोंदणीतील सर्व माहिती खरी व अचूक असावी.",
            "सर्व नियमांचे पालन करणे बंधनकारक आहे.",
            "परीक्षकांचा निर्णय अंतिम राहील."
          ]
        }
      ],
      "faq": [
        {
          "question": "स्पर्धेत सहभागी कसे व्हावे?",
          "answers": [
            "वर दिलेला नोंदणी फॉर्म भरून आपले नाव, गाव आणि गट नोंदवा. त्यानंतर आपला आवडता गड बनवून त्याचे फोटो व व्हिडिओ सादर करा."
          ]
        },
        {
          "question": "नोंदणीसाठी कोणती माहिती आवश्यक आहे?",
          "answers": [
            "सहभागी / समूहाचे नाव, जिल्हा, संपर्क क्रमांक, ईमेल पत्ता, आपण बनवत असलेला गड व त्याचा प्रकार, तसेच फोटो / व्हिडिओची Google Drive लिंक."
          ]
        },
        {
          "question": "फोटो आणि व्हिडिओच्या लिंक कशा द्याव्यात?",
          "answers": [
            "सर्व फोटो व व्हिडिओ एकाच फोल्डरमध्ये ठेवा आणि त्या फोल्डरची एकच लिंक नोंदणी फॉर्ममध्ये टाका."
          ]
        },
        {
          "question": "Google Drive लिंकची परवानगी कशी सेट करावी?",
          "answers": [
            "फोल्डरवर राईट-क्लिक करून Share निवडा. General access मध्ये 'Anyone with the link' निवडा आणि भूमिका 'Viewer' ठेवा. नंतर लिंक कॉपी करा."
          ]
        },
        {
          "question": "प्रमाणपत्र कसे मिळेल?",
          "answers": [
            "स्पर्धेत सहभागी होणाऱ्या प्रत्येकाला सहभाग प्रमाणपत्र दिले जाईल. वितरणाची पद्धत आयोजकांकडून कळवली जाईल."
          ]
        },
        {
          "question": "अधिक माहितीसाठी कोणाशी संपर्क साधावा?",
          "answers": [
            "पृष्ठाच्या तळाशी दिलेल्या मोबाईल क्रमांकांवर किंवा ई-मेलवर आयोजकांशी संपर्क साधा: 9892435999, 9987393638 · shivbapratishthantrust@gmail.com"
          ]
        }
      ]
    },
    "certificatePreview": {
      "title": "Certificate Preview",
      "subtitle": "तुमचे सहभाग प्रमाणपत्र",
      "loading": "प्रमाणपत्र लोड करत आहोत…",
      "unavailable": "Certificate preview उपलब्ध नाही. कृपया नोंदणी पानावरून पुन्हा उघडा.",
      "notLoaded": "Certificate preview लोड झाले नाही. कृपया मागील tab मधून पुन्हा प्रयत्न करा.",
      "participationCertificate": "Participation certificate",
      "download": "Download Certificate",
      "label": "प्रमाणपत्र:"
    },
    "messages": {
      "invalidForm": "कृपया नोंदणी पूर्ण करण्यापूर्वी दाखवलेली माहिती दुरुस्त करा.",
      "individualPlaceholder": "उदा. रोहन पाटील",
      "groupPlaceholder": "उदा. शिवबा प्रतिष्ठान समूह",
      "submitting": "नोंदणी पाठवत आहोत…",
      "savedAndGenerating": "नोंदणी जतन झाली. प्रमाणपत्र तयार करत आहोत…",
      "generatingCertificate": "प्रमाणपत्र तयार करत आहोत…",
      "certificateFailed": "प्रमाणपत्र तयार करता आले नाही. कृपया पुन्हा प्रयत्न करा.",
      "certificatePdfFailed": "प्रमाणपत्राची PDF फाइल तयार करता आली नाही. कृपया पुन्हा प्रयत्न करा.",
      "saved": "नोंदणी यशस्वीरीत्या जतन झाली.",
      "savedCertificateFailed": "नोंदणी जतन झाली; परंतु प्रमाणपत्र तयार करता आले नाही. पुन्हा प्रयत्न करा.",
      "invalidSubmit": "नोंदणी पाठवत आहोत…",
      "registrationFailed": "नोंदणी जतन झाली नाही. कृपया पुन्हा प्रयत्न करा.",
      "serviceUnavailable": "नोंदणी सेवा सध्या उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा.",
      "previewUnavailable": "प्रमाणपत्राचा preview उघडता आला नाही. कृपया पुन्हा प्रयत्न करा.",
      "popupBlocked": "नवीन tab उघडला नाही. कृपया या वेबसाइटसाठी pop-ups सुरू करा.",
      "previewNotLoaded": "नवीन tab मध्ये certificate preview लोड झाले नाही. पुन्हा प्रयत्न करा.",
      "successTitle": "Registration Successful!",
      "certificateReady": "Your participation certificate is ready.",
      "certificateFor": "प्रमाणपत्रासाठी",
      "previewAction": "Preview Certificate",
      "downloadAction": "Download Certificate",
      "close": "Close certificate",
      "retry": "पुन्हा प्रयत्न करा",
      "submitButtonSubmitting": "नोंदणी पाठवत आहोत…",
      "submitButtonSuccess": "नोंदणी जतन झाली",
      "submitButtonIdle": "नोंदणी पूर्ण करा",
      "menuOpen": "मेनू उघडा",
      "menuClose": "मेनू बंद करा",
      "apiInvalidRequest": "अवैध विनंती. कृपया फॉर्म पुन्हा तपासा.",
      "apiInvalidForm": "अवैध फॉर्म माहिती.",
      "apiCorrectInformation": "कृपया दाखवलेली माहिती दुरुस्त करा.",
      "apiRegistrationUnconfigured": "नोंदणी सेवा सध्या कॉन्फिगर केलेली नाही. कृपया नंतर पुन्हा प्रयत्न करा.",
      "apiAppsScriptConfig": "Google Apps Script URL कॉन्फिगरेशन तपासा.",
      "apiUnreadableSheets": "Google Sheets कडून वाचता येण्याजोगा प्रतिसाद मिळाला नाही.",
      "apiDuplicateRegistration": "या व्यक्तीचे किंवा समूहाचे नाव आधीच नोंदवले आहे. प्रत्येक व्यक्ती किंवा समूहासाठी एकच नोंदणी करता येते.",
      "apiSheetsSaveFailed": "माहिती Google Sheets मध्ये जतन झाली नाही. कृपया पुन्हा प्रयत्न करा.",
      "apiRegistrationSaved": "नोंदणी यशस्वीरीत्या जतन झाली.",
      "apiCertificateConfirmation": "प्रमाणपत्र तयार करण्यासाठी नोंदणी यशस्वी झाल्याची पुष्टी आवश्यक आहे.",
      "apiCertificateInvalidRequest": "अवैध प्रमाणपत्र विनंती.",
      "apiCertificateInvalidName": "कृपया सहभागीचे वैध नाव द्या.",
      "apiCertificateNameTooLong": "हे नाव प्रमाणपत्रावर बसण्यासाठी खूप मोठे आहे."
    },
    "validationErrors": {
      "registrationType": [
        "नोंदणीचा प्रकार निवडा."
      ],
      "name": [
        "सहभागी किंवा समूहाचे नाव आवश्यक आहे.",
        "नाव २ ते ८० अक्षरांचे असावे.",
        "नावात फक्त अक्षरे आणि मोकळ्या जागा वापरा."
      ],
      "district": [
        "जिल्हा किंवा परिसर निवडा."
      ],
      "mobile": [
        "संपर्क क्रमांक आवश्यक आहे.",
        "भारतीय मोबाईल क्रमांक ६, ७, ८ किंवा ९ ने सुरू होणारे १० अंकांचे असावे."
      ],
      "alternateMobile": [
        "पर्यायी क्रमांक रिकामा ठेवा किंवा १० अंकी भारतीय मोबाईल क्रमांक द्या."
      ],
      "email": [
        "ईमेल पत्ता आवश्यक आहे.",
        "वैध ईमेल पत्ता द्या."
      ],
      "fortName": [
        "आपण बनवत असलेल्या गडाचे नाव आवश्यक आहे.",
        "गडाचे नाव २ ते ८० अक्षरांचे असावे.",
        "गडाच्या नावात फक्त अक्षरे आणि मोकळ्या जागा वापरा."
      ],
      "fortType": [
        "गडाचा प्रकार निवडा."
      ],
      "driveFolderUrl": [
        "Google Drive फोल्डरची लिंक आवश्यक आहे.",
        "Google Drive मधील वैध फोल्डर लिंक द्या.",
        "वैध Google Drive फोल्डर लिंक द्या.",
        "फोल्डरची लिंक २०४८ अक्षरांपेक्षा मोठी नसावी."
      ],
      "consent": [
        "नोंदणीसाठी नियम व अटी मान्य करणे आवश्यक आहे."
      ]
    },
    "validationOptions": {
      "districts": [
        "अहिल्यानगर",
        "अकोला",
        "अमरावती",
        "बीड",
        "भंडारा",
        "बुलढाणा",
        "चंद्रपूर",
        "छत्रपती संभाजीनगर",
        "धाराशिव",
        "धुळे",
        "गडचिरोली",
        "गोंदिया",
        "हिंगोली",
        "जळगाव",
        "जालना",
        "कोल्हापूर",
        "लातूर",
        "मुंबई शहर",
        "मुंबई उपनगर",
        "नागपूर",
        "नांदेड",
        "नंदुरबार",
        "नाशिक",
        "पालघर",
        "परभणी",
        "पुणे",
        "रायगड",
        "रत्नागिरी",
        "सांगली",
        "सातारा",
        "सिंधुदुर्ग",
        "सोलापूर",
        "ठाणे",
        "वर्धा",
        "वाशिम",
        "यवतमाळ",
        "इतर"
      ]
    },
    "languageSwitcher": {
      "label": "भाषा निवडा",
      "marathi": "मराठी",
      "english": "English"
    }
  },
  "en": {
    "site": {
      "title": "Shivba Pratishthan – Fort Construction Competition",
      "description": "Shivba Pratishthan Fort Construction Competition",
      "favicon": "/favicon.ico"
    },
    "layout": {
      "header": {
        "logo": {
          "src": "/images/trust-seal.png",
          "alt": "Shivba Pratishthan Trust logo",
          "width": 52,
          "height": 52
        },
        "brand": "Shivba Pratishthan Trust",
        "navLabel": "Main navigation",
        "navigation": [
          {
            "href": "#about",
            "label": "About us"
          },
          {
            "href": "#join",
            "label": "Participation"
          },
          {
            "href": "#gallery",
            "label": "Gallery"
          },
          {
            "href": "#rules",
            "label": "Rules"
          }
        ],
        "action": {
          "href": "#register",
          "label": "Register"
        }
      },
      "footer": {
        "logo": {
          "src": "/images/trust-seal.png",
          "alt": "Shivba Pratishthan Trust logo",
          "width": 80,
          "height": 80
        },
        "brand": "Shivba Pratishthan Trust",
        "description": [
          "An organization committed to social service",
          "Fort Construction Competition 2026"
        ],
        "contact": {
          "label": "Contact",
          "lines": [
            "9892435999",
            "9987393638",
            "shivbapratishthantrust@gmail.com"
          ]
        },
        "address": {
          "label": "Address",
          "lines": [
            "Shivba Pratishthan Trust Office, Vighneshwar 2B,",
            "Chhatrapati Sambhaji Maharaj Nagar, opposite D Mart,",
            "Koladongri, Sahar Road, Andheri East, Mumbai 69"
          ]
        },
        "social": {
          "instagram": {
            "href": "https://www.instagram.com/__shivbapratishthantrust/",
            "label": "Follow us on Instagram"
          }
        },
        "copyright": "© 2026 Shivba Pratishthan Trust"
      }
    },
    "sections": {
      "top": {
        "tagline": "Presented by Shivba Pratishthan Trust",
        "title": "The world’s first international fort-building competition 2026",
        "image": {
          "src": "/images/shivba-wordmark.png",
          "alt": "The world’s first international fort-building competition 2026"
        },
        "description": "Build your forts from the soil of Diwali. Give shape to our history with your own hands.",
        "primaryButton": "Register now",
        "primaryHref": "#register",
        "secondaryButton": "How to participate",
        "secondaryHref": "#join",
        "details": [
          {
            "label": "Date",
            "value": "Last date: 21 November 2026"
          },
          {
            "label": "Location",
            "value": "[Location]"
          },
          {
            "label": "Fee",
            "value": "Free of cost"
          }
        ]
      },
      "about": {
        "eyebrow": "About us",
        "title": "Shivba Pratishthan Trust",
        "paragraphs": [
          "Shivba Pratishthan Trust is an organization committed to social work and preserving the legacy of Chhatrapati Shivaji Maharaj’s ideals. [Add the trust’s founding details and work here.]",
          "Through the fort-building competition, we aim to help the next generation experience the history, architecture, and pride of our forts up close."
        ]
      },
      "join": {
        "eyebrow": "Participation",
        "title": "How to participate",
        "description": "From the foot of the fort to its summit, in just four simple steps.",
        "steps": [
          {
            "number": "1",
            "label": "Step 1",
            "title": "Register",
            "description": "Fill in the form above with your name, village, and group.",
            "icon": "registration"
          },
          {
            "number": "2",
            "label": "Step 2",
            "title": "Choose a fort",
            "description": "Choose your favourite fort to recreate.",
            "icon": "fort"
          },
          {
            "number": "3",
            "label": "Step 3",
            "title": "Build a model",
            "description": "Create your fort using soil, stones, and natural materials.",
            "icon": "model"
          },
          {
            "number": "4",
            "label": "Step 4",
            "title": "Submit photos",
            "description": "Send us photos of your completed fort by 21 November 2026.",
            "icon": "photo"
          }
        ],
        "button": "Register now"
      },
      "register": {
        "eyebrow": "Registration",
        "title": "Register your participation",
        "description": "Complete your registration by filling in the information below. Please provide accurate information. The organizers will share details of the next steps after registration is complete.",
        "requiredNote": "All information is required except fields marked optional.",
        "secureNote": "Your information is secure.",
        "registrationTypes": [
          {
            "value": "individual",
            "label": "Individual"
          },
          {
            "value": "group",
            "label": "Group"
          }
        ],
        "fields": {
          "name": {
            "label": "Participant / group name",
            "placeholder": "e.g., Rohan Patil",
            "id": "rn",
            "type": "text",
            "required": true
          },
          "district": {
            "label": "District / area",
            "placeholder": "Select your location",
            "id": "rd",
            "type": "select",
            "required": true
          },
          "mobile": {
            "label": "Contact number",
            "placeholder": "98765 43210",
            "id": "rc",
            "type": "tel",
            "required": true
          },
          "alternateMobile": {
            "label": "Alternate number",
            "placeholder": "98765 43210",
            "id": "ra",
            "type": "tel",
            "required": false
          },
          "email": {
            "label": "Email address",
            "placeholder": "you@example.com",
            "id": "re",
            "type": "email",
            "required": true
          },
          "fortName": {
            "label": "Fort you are building",
            "placeholder": "e.g., Sindhudurg",
            "id": "rf",
            "type": "text",
            "required": true
          },
          "driveFolderUrl": {
            "label": "Google Drive link for photos / videos",
            "placeholder": "https://drive.google.com/drive/folders/...",
            "id": "rg",
            "type": "url",
            "required": true
          }
        },
        "districtOptions": [
          "Ahilyanagar",
          "Akola",
          "Amravati",
          "Beed",
          "Bhandara",
          "Buldhana",
          "Chandrapur",
          "Chhatrapati Sambhajinagar",
          "Dharashiv",
          "Dhule",
          "Gadchiroli",
          "Gondia",
          "Hingoli",
          "Jalgaon",
          "Jalna",
          "Kolhapur",
          "Latur",
          "Mumbai City",
          "Mumbai Suburban",
          "Nagpur",
          "Nanded",
          "Nandurbar",
          "Nashik",
          "Palghar",
          "Parbhani",
          "Pune",
          "Raigad",
          "Ratnagiri",
          "Sangli",
          "Satara",
          "Sindhudurg",
          "Solapur",
          "Thane",
          "Wardha",
          "Washim",
          "Yavatmal",
          "Other"
        ],
        "districtSearchPlaceholder": "Search districts...",
        "districtNoResults": "No matching district found.",
        "fortTypes": [
          {
            "value": "giri",
            "label": "Hill fort",
            "description": "Hill fort",
            "icon": "mountain"
          },
          {
            "value": "jala",
            "label": "Water fort",
            "description": "Coastal / water fort",
            "icon": "water"
          },
          {
            "value": "bhui",
            "label": "Land fort",
            "description": "Fort on flat land",
            "icon": "fort"
          },
          {
            "value": "vana",
            "label": "Forest fort",
            "description": "Fort in a forest",
            "icon": "tree"
          }
        ],
        "fortTypeLabel": "Fort type",
        "mobileLengthNote": "(10 digits)",
        "alternateNote": "(Optional)",
        "driveHint": "Place all photos and videos in one folder and set access to “Anyone with the link can view.”",
        "rulesLink": "Rules",
        "submit": "Complete registration",
        "consentPrefix": "I certify that all information I have provided is accurate, and I agree to the competition",
        "consentSuffix": "rules and conditions.",
        "registrationTypeLabel": "Registration type",
        "mobilePrefix": "+91"
      },
      "gallery": {
        "eyebrow": "Gallery",
        "title": "Shivba Pratishthan Trust – Photo Gallery",
        "subtitle": "A photo collection celebrating social work, activities, and events.",
        "categories": [{"id":"all","label":"All"},{"id":"forts","label":"Forts"},{"id":"social","label":"Social Programs"}],
        "noResults": "No photos are currently available in this category.",
        "showMore": "See more photos",
        "closePreview": "Close image preview",
        "previousImage": "Previous image",
        "nextImage": "Next image",
        "items": [          {
            "src": "/gallery/%E0%A4%B6%E0%A4%BF%E0%A4%B5%E0%A4%B0%E0%A4%BE%E0%A4%AF%20%E0%A4%85%E0%A4%B8%E0%A5%87%20%E0%A4%B6%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%BF%E0%A4%A6%E0%A4%BE%E0%A4%A4%E0%A4%BE....%20(2).jpg",
            "alt": "A stage performance at a Shiv Jayanti event.",
            "category": "social"
          },
          {
            "src": "/gallery/shiv-jayanti-greetings.jpg",
            "alt": "A poster with Shivba Pratishthan Trust’s Shiv Jayanti greetings and felicitation ceremony announcement.",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-06.jpg",
            "alt": "A scene from a relief and service effort for people affected by the 2019 floods.",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-05.jpg",
            "alt": "A scene from a relief and service effort for people affected by the 2019 floods.",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-04.jpg",
            "alt": "A scene from a relief and service effort for people affected by the 2019 floods.",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-02.jpg",
            "alt": "A scene from a relief and service effort for people affected by the 2019 floods.",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-03.jpg",
            "alt": "A scene from a relief and service effort for people affected by the 2019 floods.",
            "category": "social"
          },
          {
            "src": "/gallery/flood-relief-2019-01.jpg",
            "alt": "A scene from a relief and service effort for people affected by the 2019 floods.",
            "category": "social"
          },
          {
            "src": "/gallery/shivprerna-jyot-04.jpg",
            "alt": "A scene from the Shivprerna Jyot program held for Shiv Jayanti.",
            "category": "social"
          },
          {
            "src": "/gallery/shivprerna-jyot-03.jpg",
            "alt": "A scene from the Shivprerna Jyot program held for Shiv Jayanti.",
            "category": "social"
          },
          {
            "src": "/gallery/shivprerna-jyot-02.jpg",
            "alt": "A scene from the Shivprerna Jyot program held for Shiv Jayanti.",
            "category": "social"
          },
          {
            "src": "/gallery/shivprerna-jyot-01.jpg",
            "alt": "A scene from the Shivprerna Jyot program held for Shiv Jayanti.",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-05.jpg",
            "alt": "Shivba Pratishthan Trust distributing T-shirts to the Chhatrapati Sambhaji Maharaj Nagar volleyball team.",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-04.jpg",
            "alt": "Shivba Pratishthan Trust distributing T-shirts to the Chhatrapati Sambhaji Maharaj Nagar volleyball team.",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-03.jpg",
            "alt": "Shivba Pratishthan Trust distributing T-shirts to the Chhatrapati Sambhaji Maharaj Nagar volleyball team.",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-02.jpg",
            "alt": "Shivba Pratishthan Trust distributing T-shirts to the Chhatrapati Sambhaji Maharaj Nagar volleyball team.",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-shirt-distribution-01.jpg",
            "alt": "Shivba Pratishthan Trust distributing T-shirts to the Chhatrapati Sambhaji Maharaj Nagar volleyball team.",
            "category": "social"
          },
          {
            "src": "/gallery/volleyball-parle-third-place.jpg",
            "alt": "A poster congratulating the Chhatrapati Sambhaji Maharaj Nagar volleyball team for winning third place at the Parle Festival.",
            "category": "social"
          },

          {
            "src": "/gallery/gallery1.jpg",
            "alt": "Participants standing beside their fort model",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery3.jpeg",
            "alt": "A colorful fort model with detailed decorations",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery4.jpg",
            "alt": "A water fort model surrounded by water",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery5.jpg",
            "alt": "Participants gathered around a fort model",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery6.jpg",
            "alt": "A model of Purandar Fort",
            "category": "forts"
          },
          {
            "src": "/gallery/gallery7.webp",
            "alt": "A wide view of a coastal fort model",
            "category": "forts"
          },
          {
            "src": "/gallery/raigad-new-year-honors-01.jpg",
            "alt": "Award and certificate presentation ceremony at Raigad Fort.",
            "category": "social"
          },
          {
            "src": "/gallery/raigad-new-year-honors-02.jpg",
            "alt": "Devotees attending the felicitation ceremony at Raigad Fort.",
            "category": "social"
          },
          {
            "src": "/gallery/raigad-new-year-honors-03.jpg",
            "alt": "Awards ceremony at Raigad Fort.",
            "category": "social"
          }
        ]
      },
      "winners": {
        "title": "Competition winners",
        "description": "Honouring the winners for their outstanding performance in the fort-building competition.",
        "yearTabs": [
          {
            "value": "25",
            "label": "2025"
          },
          {
            "value": "24",
            "label": "2024"
          }
        ],
        "years": {
          "0": [
            {
              "team": "Winning group name",
              "fort": "[Fort name]",
              "image": {
                "src": "",
                "alt": "[Fort photos]"
              }
            },
            {
              "team": "Winning group name",
              "fort": "[Fort name]",
              "image": {
                "src": "",
                "alt": "[Fort photos]"
              }
            },
            {
              "team": "Winning group name",
              "fort": "[Fort name]",
              "image": {
                "src": "",
                "alt": "[Fort photos]"
              }
            }
          ],
          "24": [
            {
              "position": "Second prize",
              "team": "Vishwakarma Navtarun Mitra Mandal, Satara",
              "fort": "",
              "image": {
                "src": "/images/winner-2.jpg",
                "alt": "2024 Second Prize – Vishwakarma Navtarun Mitra Mandal, Satara"
              }
            },
            {
              "position": "First prize",
              "team": "Shivsankalp Mitra Samuh, Satara",
              "fort": "",
              "image": {
                "src": "/images/winner-1.jpg",
                "alt": "2024 First Prize – Shivsankalp Mitra Samuh, Satara"
              }
            },
            {
              "position": "Third prize",
              "team": "Vijeta Krida Mandal, Kolhapur",
              "fort": "",
              "image": {
                "src": "/images/winner-3.jpg",
                "alt": "2024 Third Prize – Vijeta Krida Mandal, Kolhapur"
              }
            }
          ],
          "2": [
            {
              "team": "Winning group name",
              "fort": "[Fort name]",
              "image": {
                "src": "",
                "alt": "[Fort photos]"
              }
            },
            {
              "team": "Winning group name",
              "fort": "[Fort name]",
              "image": {
                "src": "",
                "alt": "[Fort photos]"
              }
            },
            {
              "team": "Winning group name",
              "fort": "[Fort name]",
              "image": {
                "src": "",
                "alt": "[Fort photos]"
              }
            }
          ],
          "25": [
            {
              "position": "Second prize",
              "team": "Dharmaveer Pratishthan, Satara",
              "fort": "Ajinkyatara Fort",
              "image": {
                "src": "/images/second-place-photo.jpg",
                "alt": "2025 Second Prize – Dharmaveer Pratishthan, Satara"
              }
            },
            {
              "position": "First prize",
              "team": "Omkar Mitra Mandal, Thane",
              "fort": "Janjira and Padmadurg",
              "image": {
                "src": "/images/first-place-photo.jpg",
                "alt": "2025 First Prize – Omkar Mitra Mandal, Thane"
              }
            },
            {
              "position": "Third prize",
              "team": "Azad Sports Club, Bhandup",
              "fort": "Jinji Fort",
              "image": {
                "src": "/images/third-place-photo.jpg",
                "alt": "2025 Third Prize – Azad Sports Club, Bhandup"
              }
            }
          ]
        },
        "thankYou": "We sincerely thank everyone who took part in this competition.",
        "yearLabel": "Year"
      },
      "rules": {
        "eyebrow": "Rules and conditions",
        "title": "Competition rules and conditions",
        "description": "Participants should read and understand the following rules and conditions. All rules must be followed."
      },
      "faq": {
        "eyebrow": "Frequently asked questions",
        "title": "Frequently asked questions"
      },
      "cta": {
        "eyebrow": "Shivba Pratishthan Trust",
        "button": "Join the competition",
        "href": "#register",
        "titleLines": [
          "Let us preserve the legacy of our forts,",
          "and pass it on to the next generation."
        ]
      }
    },
    "accordions": {
      "rules": [
        {
          "question": "Competition rules",
          "answers": [
            "This competition will be conducted online.",
            "The fort should be from the year 2026.",
            "Submit a 2-minute video along with information about the fort.",
            "Submit 2 to 3 photographs of the fort.",
            "Participants must fill out the Google Form.",
            "Preference will be given to videos that include information about the fort.",
            "The submitted fort video should be posted as a collaboration with Shivba Pratishthan Trust’s Instagram profile.",
            "The deadline to submit the video and photographs is 21 November 2026."
          ]
        },
        {
          "question": "Eligibility",
          "answers": [
            "This competition is open to everyone. Anyone who is interested in forts, as an individual or as part of a group, may participate."
          ]
        },
        {
          "question": "How to participate",
          "answers": [
            "Complete and submit the registration form.",
            "Only one registration will be accepted for each fort.",
            "The model must be original and made by the participant.",
            "Use natural materials such as soil, stones, and wood."
          ]
        },
        {
          "question": "Photo / video submission",
          "answers": [
            "Photos of the completed fort must be submitted by 21 November 2026.",
            "Keep all photos and videos in one Google Drive folder.",
            "Set the folder access to “Anyone with the link can view.”"
          ]
        },
        {
          "question": "Important instructions",
          "answers": [
            "All information in the registration must be true and accurate.",
            "All rules must be followed.",
            "The judges’ decision will be final."
          ]
        }
      ],
      "faq": [
        {
          "question": "How can I participate in the competition?",
          "answers": [
            "Fill in the registration form above with your name, village, and group. Then build a model of your favourite fort and submit its photos and video."
          ]
        },
        {
          "question": "What information is required to register?",
          "answers": [
            "The participant or group name, district, contact number, email address, the fort being built and its type, and the Google Drive link for the photos / video."
          ]
        },
        {
          "question": "How should I share the photo and video links?",
          "answers": [
            "Put all photos and videos in one folder and enter that folder’s single link in the registration form."
          ]
        },
        {
          "question": "How do I set permissions for a Google Drive link?",
          "answers": [
            "Right-click the folder and select Share. Under General access, choose “Anyone with the link” and set the role to “Viewer.” Then copy the link."
          ]
        },
        {
          "question": "How will I receive a certificate?",
          "answers": [
            "Every participant in the competition will receive a participation certificate. The organizers will share how it will be distributed."
          ]
        },
        {
          "question": "Who should I contact for more information?",
          "answers": [
            "Contact the organizers using either mobile number or the email address listed at the bottom of the page: 9892435999, 9987393638 · shivbapratishthantrust@gmail.com"
          ]
        }
      ]
    },
    "certificatePreview": {
      "title": "Certificate Preview",
      "subtitle": "Your participation certificate",
      "loading": "Loading certificate…",
      "unavailable": "Certificate preview is unavailable. Please open it again from the registration page.",
      "notLoaded": "The certificate preview did not load. Please try again from the previous tab.",
      "participationCertificate": "Participation certificate",
      "download": "Download Certificate",
      "label": "Certificate:"
    },
    "messages": {
      "invalidForm": "Please correct the information shown before completing registration.",
      "individualPlaceholder": "e.g., Rohan Patil",
      "groupPlaceholder": "e.g., Shivba Pratishthan group",
      "submitting": "Submitting registration…",
      "savedAndGenerating": "Registration saved. Generating your certificate…",
      "generatingCertificate": "Generating certificate…",
      "certificateFailed": "The certificate could not be generated. Please try again.",
      "certificatePdfFailed": "The certificate PDF could not be created. Please try again.",
      "saved": "Registration saved successfully.",
      "savedCertificateFailed": "Registration was saved, but the certificate could not be generated. Please try again.",
      "invalidSubmit": "Submitting registration…",
      "registrationFailed": "Registration could not be saved. Please try again.",
      "serviceUnavailable": "The registration service is currently unavailable. Please try again.",
      "previewUnavailable": "The certificate preview could not be opened. Please try again.",
      "popupBlocked": "A new tab did not open. Please enable pop-ups for this website.",
      "previewNotLoaded": "The certificate preview did not load in the new tab. Please try again.",
      "successTitle": "Registration Successful!",
      "certificateReady": "Your participation certificate is ready.",
      "certificateFor": "Certificate for",
      "previewAction": "Preview Certificate",
      "downloadAction": "Download Certificate",
      "close": "Close certificate",
      "retry": "Try again",
      "submitButtonSubmitting": "Submitting registration…",
      "submitButtonSuccess": "Registration saved",
      "submitButtonIdle": "Complete registration",
      "menuOpen": "Open menu",
      "menuClose": "Close menu",
      "apiInvalidRequest": "Invalid request. Please check the form and try again.",
      "apiInvalidForm": "Invalid form data.",
      "apiCorrectInformation": "Please correct the information shown.",
      "apiRegistrationUnconfigured": "The registration service is not configured yet. Please try again later.",
      "apiAppsScriptConfig": "Check the Google Apps Script URL configuration.",
      "apiUnreadableSheets": "Could not read a valid response from Google Sheets.",
      "apiDuplicateRegistration": "This person or group is already registered. Only one registration is allowed per person or group.",
      "apiSheetsSaveFailed": "The information could not be saved to Google Sheets. Please try again.",
      "apiRegistrationSaved": "Registration saved successfully.",
      "apiCertificateConfirmation": "A successful registration must be confirmed before a certificate can be generated.",
      "apiCertificateInvalidRequest": "Invalid certificate request.",
      "apiCertificateInvalidName": "Please provide a valid participant name.",
      "apiCertificateNameTooLong": "This name is too long to fit on the certificate."
    },
    "validationErrors": {
      "registrationType": [
        "Select a registration type."
      ],
      "name": [
        "Participant or group name is required.",
        "Name must be between 2 and 80 characters.",
        "Use letters and spaces only in the name."
      ],
      "district": [
        "Select a district or area."
      ],
      "mobile": [
        "Contact number is required.",
        "An Indian mobile number must contain 10 digits and start with 6, 7, 8, or 9."
      ],
      "alternateMobile": [
        "Leave the alternate number blank or enter a valid 10-digit Indian mobile number."
      ],
      "email": [
        "Email address is required.",
        "Enter a valid email address."
      ],
      "fortName": [
        "The name of the fort you are building is required.",
        "Fort name must be between 2 and 80 characters.",
        "Use letters and spaces only in the fort name."
      ],
      "fortType": [
        "Select a fort type."
      ],
      "driveFolderUrl": [
        "Google Drive folder link is required.",
        "Enter a valid Google Drive folder link.",
        "Enter a valid Google Drive folder link.",
        "The folder link must not exceed 2,048 characters."
      ],
      "consent": [
        "You must agree to the rules and conditions to register."
      ]
    },
    "validationOptions": {
      "districts": [
        "Ahilyanagar",
        "Akola",
        "Amravati",
        "Beed",
        "Bhandara",
        "Buldhana",
        "Chandrapur",
        "Chhatrapati Sambhajinagar",
        "Dharashiv",
        "Dhule",
        "Gadchiroli",
        "Gondia",
        "Hingoli",
        "Jalgaon",
        "Jalna",
        "Kolhapur",
        "Latur",
        "Mumbai City",
        "Mumbai Suburban",
        "Nagpur",
        "Nanded",
        "Nandurbar",
        "Nashik",
        "Palghar",
        "Parbhani",
        "Pune",
        "Raigad",
        "Ratnagiri",
        "Sangli",
        "Satara",
        "Sindhudurg",
        "Solapur",
        "Thane",
        "Wardha",
        "Washim",
        "Yavatmal",
        "Other"
      ]
    },
    "languageSwitcher": {
      "label": "Choose language",
      "marathi": "Marathi",
      "english": "English"
    }
  }
};

export default content;
