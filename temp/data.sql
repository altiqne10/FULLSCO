--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.categories (id, name, slug, description) FROM stdin;
1	الهندسة	engineering	منح دراسية في مجالات الهندسة المختلفة
2	الطب والعلوم الصحية	medical-sciences	منح دراسية في الطب والعلوم الصحية والتمريض
3	علوم الحاسوب	computer-science	منح دراسية في تخصصات الحاسوب والذكاء الاصطناعي
4	العلوم الطبيعية	natural-sciences	منح دراسية في الفيزياء والكيمياء والأحياء
5	العلوم الإنسانية	humanities	منح دراسية في الآداب والعلوم الإنسانية
6	إدارة الأعمال	business	منح دراسية في إدارة الأعمال والاقتصاد
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, display_name, email, role, created_at) FROM stdin;
1	admin	admin123	System Administrator	admin@example.com	admin	2025-05-01 18:44:57.928032
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.posts (id, title, content, excerpt, slug, author_id, status, created_at, updated_at) FROM stdin;
1	كيفية التقديم للمنح الدراسية بنجاح	\n<h2>مقدمة</h2>\n<p>يعد التقديم للمنح الدراسية خطوة مهمة في مسيرة الطالب الأكاديمية. فالمنح الدراسية توفر الدعم المالي اللازم للطلاب الذين يرغبون في متابعة تعليمهم العالي دون القلق بشأن الأعباء المالية.</p>\n\n<h2>الخطوات الأساسية للتقديم</h2>\n<p>هناك عدة خطوات أساسية يجب اتباعها عند التقديم للمنح الدراسية:</p>\n<ol>\n  <li><strong>البحث الجيد:</strong> ابحث عن المنح التي تناسب تخصصك ومؤهلاتك.</li>\n  <li><strong>قراءة المتطلبات:</strong> تأكد من قراءة جميع متطلبات المنحة بعناية وتأكد من استيفائها.</li>\n  <li><strong>تجهيز المستندات:</strong> جهز جميع المستندات المطلوبة مثل السيرة الذاتية والشهادات والتوصيات.</li>\n  <li><strong>كتابة رسالة الدافع:</strong> اكتب رسالة دافع قوية تشرح فيها سبب استحقاقك للمنحة.</li>\n  <li><strong>تقديم الطلب:</strong> تقديم الطلب قبل الموعد النهائي.</li>\n</ol>\n\n<h2>نصائح للحصول على منحة دراسية</h2>\n<p>إليك بعض النصائح التي ستساعدك في الحصول على منحة دراسية:</p>\n<ul>\n  <li>ابدأ البحث مبكراً وحدد المنح التي تناسب اهتماماتك وقدراتك.</li>\n  <li>اجمع توصيات قوية من أساتذتك أو مشرفيك.</li>\n  <li>اكتب رسالة دافع مقنعة ومؤثرة تبرز إنجازاتك وطموحاتك.</li>\n  <li>تقدم إلى أكثر من منحة لزيادة فرصك في القبول.</li>\n  <li>اهتم بتفاصيل الطلب والمواعيد النهائية.</li>\n</ul>\n\n<h2>الأخطاء الشائعة وكيفية تجنبها</h2>\n<p>هناك بعض الأخطاء الشائعة التي يرتكبها الطلاب عند التقديم للمنح الدراسية:</p>\n<ul>\n  <li>التقديم بعد الموعد النهائي.</li>\n  <li>عدم قراءة شروط المنحة بعناية.</li>\n  <li>كتابة رسالة دافع ضعيفة أو غير مقنعة.</li>\n  <li>تقديم مستندات غير مكتملة.</li>\n  <li>عدم التدقيق اللغوي في الطلب والمستندات المرفقة.</li>\n</ul>\n\n<h2>الخاتمة</h2>\n<p>التقديم للمنح الدراسية قد يبدو عملية معقدة، لكن مع الإعداد الجيد والتخطيط المناسب، يمكنك زيادة فرصك في الحصول على المنحة التي تناسب طموحاتك وتطلعاتك الأكاديمية. لا تنسى أن النجاح في الحصول على منحة دراسية يتطلب الصبر والمثابرة والجهد المستمر.</p>\n	التقديم للمنح الدراسية يتطلب التخطيط والإعداد الجيد. تعرف على أهم الخطوات والنصائح للتقديم بنجاح والحصول على منحة دراسية.	how-to-apply-for-scholarships	1	published	2025-05-01 19:29:59.032848	2025-05-01 19:29:59.032848
2	أفضل 5 منح دراسية للطلاب العرب	\n<h2>مقدمة</h2>\n<p>يبحث الكثير من الطلاب العرب عن فرص للدراسة في الخارج من خلال المنح الدراسية. تتوفر العديد من المنح الدراسية التي تستهدف الطلاب العرب بشكل خاص، وتوفر لهم فرصًا للدراسة في جامعات مرموقة حول العالم.</p>\n\n<h2>1. منحة الفولبرايت للطلاب العرب</h2>\n<p>تعتبر منحة الفولبرايت واحدة من أهم المنح الدراسية المتاحة للطلاب العرب. توفر هذه المنحة فرصة للدراسة في الولايات المتحدة الأمريكية للحصول على درجة الماجستير أو الدكتوراه. تغطي المنحة الرسوم الدراسية بالكامل، بالإضافة إلى راتب شهري، وتذاكر السفر، والتأمين الصحي.</p>\n\n<h2>2. منحة اليابان الحكومية (MEXT)</h2>\n<p>تقدم الحكومة اليابانية منحًا دراسية للطلاب العرب للدراسة في الجامعات اليابانية. تشمل المنحة الرسوم الدراسية، وبدل شهري، وتذاكر السفر. يمكن للطلاب التقدم للدراسة في مختلف المستويات: البكالوريوس، الماجستير، والدكتوراه.</p>\n\n<h2>3. منحة شيفنينج البريطانية</h2>\n<p>تقدم حكومة المملكة المتحدة منح شيفنينج للطلاب المتميزين من مختلف دول العالم، بما في ذلك الدول العربية. تغطي المنحة الرسوم الدراسية، وراتبًا شهريًا، وتكاليف السفر. تستهدف المنحة الطلاب الراغبين في الحصول على درجة الماجستير لمدة عام واحد.</p>\n\n<h2>4. منحة DAAD الألمانية</h2>\n<p>تقدم الهيئة الألمانية للتبادل الأكاديمي (DAAD) منحًا دراسية للطلاب العرب للدراسة في الجامعات الألمانية. تتوفر المنح لمختلف المستويات والتخصصات. تغطي المنحة الرسوم الدراسية وتكاليف المعيشة.</p>\n\n<h2>5. المنح الدراسية في تركيا</h2>\n<p>تقدم الحكومة التركية منحًا دراسية للطلاب الدوليين، بما في ذلك الطلاب العرب. تشمل المنحة الرسوم الدراسية، وسكنًا جامعيًا، وتأمينًا صحيًا، وراتبًا شهريًا. تتوفر المنح لمختلف المستويات: البكالوريوس، الماجستير، والدكتوراه.</p>\n\n<h2>نصائح للتقديم</h2>\n<p>إليك بعض النصائح التي ستساعدك في التقديم للمنح الدراسية المذكورة أعلاه:</p>\n<ul>\n  <li>ابدأ في التحضير مبكرًا وتعرف على متطلبات كل منحة.</li>\n  <li>جهز مستنداتك بعناية واهتمام.</li>\n  <li>اكتب رسالة دافع قوية تبرز إنجازاتك وطموحاتك.</li>\n  <li>تأكد من حصولك على توصيات قوية.</li>\n  <li>استعد جيدًا للمقابلات الشخصية إذا كانت ضمن متطلبات المنحة.</li>\n</ul>\n\n<h2>الخاتمة</h2>\n<p>هناك العديد من الفرص المتاحة للطلاب العرب للدراسة في الخارج من خلال المنح الدراسية. الأمر يتطلب البحث والتخطيط والإعداد الجيد. نتمنى لكم التوفيق في رحلتكم الأكاديمية.</p>\n	استكشف أفضل 5 منح دراسية متاحة للطلاب العرب، بما في ذلك منحة الفولبرايت، منحة MEXT اليابانية، منحة شيفنينج البريطانية، منحة DAAD الألمانية، والمنح التركية.	top-5-scholarships-for-arab-students	1	published	2025-05-01 19:29:59.032848	2025-05-01 19:29:59.032848
3	كيفية كتابة رسالة دافع مؤثرة	\n<h2>مقدمة</h2>\n<p>تعتبر رسالة الدافع (Motivation Letter) أو خطاب النية (Statement of Purpose) من أهم المستندات التي يجب على الطالب إعدادها عند التقديم للمنح الدراسية أو القبول في الجامعات. تهدف هذه الرسالة إلى إقناع لجنة القبول بأنك المرشح المثالي للمنحة أو البرنامج الدراسي.</p>\n\n<h2>ما هي رسالة الدافع؟</h2>\n<p>رسالة الدافع هي مستند يشرح فيه الطالب دوافعه للتقدم إلى منحة دراسية أو برنامج أكاديمي معين. تعرض هذه الرسالة خلفية الطالب، وإنجازاته، وأهدافه المستقبلية، وتوضح سبب اختياره لهذا البرنامج بالتحديد.</p>\n\n<h2>هيكل رسالة الدافع</h2>\n<p>تتكون رسالة الدافع المؤثرة من عدة أجزاء رئيسية:</p>\n\n<h3>1. المقدمة</h3>\n<p>يجب أن تكون المقدمة جذابة وتلفت انتباه القارئ. يمكنك البدء بقصة شخصية قصيرة أو تجربة ملهمة أثرت في اختيارك للتخصص أو المسار الدراسي.</p>\n\n<h3>2. خلفيتك الأكاديمية والمهنية</h3>\n<p>في هذا الجزء، اشرح خلفيتك التعليمية والخبرات العملية ذات الصلة. ركز على الإنجازات والمهارات التي تؤهلك للبرنامج الذي تتقدم إليه.</p>\n\n<h3>3. سبب اختيارك للبرنامج أو المنحة</h3>\n<p>وضح أسباب اختيارك لهذا البرنامج أو المنحة بالتحديد. اشرح كيف ستساعدك هذه الفرصة في تحقيق أهدافك المهنية والأكاديمية.</p>\n\n<h3>4. أهدافك المستقبلية</h3>\n<p>اشرح خططك المستقبلية وكيف سيساهم البرنامج في تحقيقها. وضح كيف ستستفيد من المعرفة والمهارات التي ستكتسبها من خلال البرنامج.</p>\n\n<h3>5. الخاتمة</h3>\n<p>اختم رسالتك بتلخيص النقاط الرئيسية وتأكيد اهتمامك والتزامك بالبرنامج.</p>\n\n<h2>نصائح لكتابة رسالة دافع مؤثرة</h2>\n<p>إليك بعض النصائح التي ستساعدك في كتابة رسالة دافع مؤثرة:</p>\n\n<ul>\n  <li><strong>كن أصيلاً:</strong> اكتب بصدق وأصالة، واجعل رسالتك تعكس شخصيتك الحقيقية.</li>\n  <li><strong>خصص الرسالة:</strong> اكتب رسالة مخصصة لكل برنامج أو منحة تتقدم إليها، وتجنب استخدام نفس الرسالة للجميع.</li>\n  <li><strong>كن محدداً:</strong> استخدم أمثلة محددة وتجارب شخصية لدعم ادعاءاتك.</li>\n  <li><strong>تجنب التكرار:</strong> لا تكرر المعلومات المذكورة في مستندات أخرى مثل السيرة الذاتية.</li>\n  <li><strong>احترم حدود الكلمات:</strong> التزم بحدود الكلمات المطلوبة وتجنب الإطالة.</li>\n  <li><strong>دقق لغوياً:</strong> تأكد من خلو رسالتك من الأخطاء الإملائية والنحوية.</li>\n  <li><strong>اطلب رأياً آخر:</strong> اطلب من شخص آخر قراءة رسالتك وتقديم ملاحظات.</li>\n</ul>\n\n<h2>الأخطاء الشائعة في كتابة رسالة الدافع</h2>\n<p>تجنب الأخطاء الشائعة التالية عند كتابة رسالة الدافع:</p>\n\n<ul>\n  <li>استخدام صيغة عامة وغير مخصصة.</li>\n  <li>التركيز فقط على الرغبة في الحصول على المنحة دون توضيح الأسباب المقنعة.</li>\n  <li>المبالغة في الادعاءات دون تقديم أدلة أو أمثلة.</li>\n  <li>سرد قصة حياتك بالكامل دون التركيز على النقاط ذات الصلة.</li>\n  <li>استخدام لغة معقدة أو جمل طويلة تصعب قراءتها.</li>\n</ul>\n\n<h2>الخاتمة</h2>\n<p>رسالة الدافع هي فرصتك لإقناع لجنة القبول بأنك المرشح المثالي. استغل هذه الفرصة جيداً من خلال كتابة رسالة صادقة، مقنعة، ومخصصة تبرز نقاط قوتك وإنجازاتك وطموحاتك. مع التخطيط والإعداد الجيد، يمكنك كتابة رسالة دافع مؤثرة تزيد من فرصك في الحصول على القبول أو المنحة التي تطمح إليها.</p>\n	تعرف على كيفية كتابة رسالة دافع قوية ومؤثرة تزيد من فرصك في الحصول على المنح الدراسية أو القبول في الجامعات العالمية.	how-to-write-effective-motivation-letter	1	published	2025-05-01 19:29:59.032848	2025-05-01 19:29:59.032848
4	تجربتي في الدراسة في ألمانيا	\n<h2>مقدمة</h2>\n<p>قررت مشاركة تجربتي في الدراسة في ألمانيا مع جميع الطلاب الذين يفكرون في الدراسة بالخارج. ألمانيا هي واحدة من أفضل الوجهات الدراسية في العالم، خاصة للطلاب الدوليين الذين يبحثون عن تعليم عالي الجودة بتكلفة معقولة.</p>\n\n<h2>لماذا اخترت ألمانيا؟</h2>\n<p>اخترت ألمانيا للأسباب التالية:</p>\n<ul>\n  <li>التعليم المجاني أو منخفض التكلفة في معظم الجامعات الحكومية.</li>\n  <li>جودة التعليم العالية والمعترف بها دولياً.</li>\n  <li>فرص عمل متعددة أثناء الدراسة وبعد التخرج.</li>\n  <li>تنوع البرامج الدراسية المتاحة باللغة الإنجليزية.</li>\n  <li>الثقافة الألمانية الغنية والحياة الاجتماعية النشطة.</li>\n</ul>\n\n<h2>التحضير للدراسة في ألمانيا</h2>\n<p>كانت مرحلة التحضير من أهم المراحل في رحلتي الدراسية. إليك أهم الخطوات التي اتبعتها:</p>\n\n<h3>1. تعلم اللغة الألمانية</h3>\n<p>رغم وجود برامج باللغة الإنجليزية، إلا أن تعلم اللغة الألمانية كان ضرورياً للتواصل اليومي والاندماج في المجتمع. بدأت بدورات أونلاين ثم التحقت بمعهد لغة في بلدي.</p>\n\n<h3>2. البحث عن الجامعات والبرامج المناسبة</h3>\n<p>استغرق مني الأمر وقتاً طويلاً للبحث عن الجامعات والبرامج التي تناسب تخصصي واهتماماتي. استخدمت مواقع مثل DAAD وStudy in Germany للحصول على معلومات دقيقة.</p>\n\n<h3>3. تجهيز المستندات</h3>\n<p>جهزت جميع المستندات المطلوبة مثل شهادة الثانوية، الشهادة الجامعية، شهادة اللغة، خطاب الدافع، وغيرها. قمت بترجمة جميع المستندات إلى اللغة الألمانية وتوثيقها.</p>\n\n<h3>4. التقديم للجامعات والحصول على القبول</h3>\n<p>تقدمت إلى عدة جامعات وحصلت على القبول في جامعة برلين التقنية. كان الحصول على القبول خطوة مهمة للتقدم للحصول على تأشيرة الدراسة.</p>\n\n<h3>5. التقديم للحصول على تأشيرة الدراسة</h3>\n<p>تقدمت للحصول على تأشيرة الدراسة في السفارة الألمانية في بلدي. احتجت إلى إثبات القدرة المالية (حساب مجمد يحتوي على حوالي 10,236 يورو) بالإضافة إلى مستندات أخرى.</p>\n\n<h3>6. تأمين السكن</h3>\n<p>بحثت عن سكن جامعي أو شقة مشتركة قبل وصولي إلى ألمانيا. كان من الصعب العثور على سكن مناسب، لكنني تمكنت من حجز غرفة في سكن جامعي.</p>\n\n<h2>الحياة والدراسة في ألمانيا</h2>\n\n<h3>النظام التعليمي</h3>\n<p>النظام التعليمي في ألمانيا يختلف عن النظام في وطني. هناك تركيز كبير على البحث العلمي والدراسة المستقلة. الطلاب لديهم حرية كبيرة في اختيار المواد والمشاركة في المحاضرات، ولكن هذا يتطلب انضباطاً ذاتياً عالياً.</p>\n\n<h3>تكاليف المعيشة</h3>\n<p>رغم أن الدراسة مجانية أو منخفضة التكلفة، إلا أن تكاليف المعيشة في ألمانيا ليست رخيصة. تختلف التكاليف حسب المدينة، حيث تعتبر مدن مثل ميونيخ وفرانكفورت أغلى من مدن أخرى مثل لايبزيغ ودريسدن. كنت أحتاج إلى حوالي 850 يورو شهرياً لتغطية تكاليف السكن، الطعام، المواصلات، والمصاريف الأخرى.</p>\n\n<h3>العمل أثناء الدراسة</h3>\n<p>يُسمح للطلاب الدوليين بالعمل 120 يوم كامل أو 240 نصف يوم سنوياً. عملت في مقهى جامعي وكمساعد بحث، مما ساعدني على تحسين لغتي الألمانية واكتساب خبرة عملية وتغطية جزء من تكاليف المعيشة.</p>\n\n<h3>الثقافة والتكيف</h3>\n<p>واجهت تحديات في التكيف مع الثقافة الألمانية في البداية. الألمان معروفون بدقتهم والتزامهم بالمواعيد والقواعد. استغرق الأمر وقتاً للتعود على نمط الحياة الجديد، لكن الجامعة وفرت برامج توجيهية ساعدتني على الاندماج.</p>\n\n<h2>النصائح للطلاب الراغبين في الدراسة في ألمانيا</h2>\n<p>بناءً على تجربتي، إليك بعض النصائح للطلاب الراغبين في الدراسة في ألمانيا:</p>\n\n<ul>\n  <li>ابدأ في تعلم اللغة الألمانية مبكراً، حتى لو كنت ستدرس باللغة الإنجليزية.</li>\n  <li>ابحث جيداً عن البرامج والجامعات قبل التقديم.</li>\n  <li>تواصل مع طلاب يدرسون حالياً في ألمانيا للحصول على نصائح عملية.</li>\n  <li>وفر مبلغاً إضافياً من المال للأشهر الأولى حتى تستقر وتجد عملاً.</li>\n  <li>استفد من الخدمات والأنشطة التي تقدمها الجامعة للطلاب الدوليين.</li>\n  <li>كن مستعداً للاعتماد على نفسك والدراسة بشكل مستقل.</li>\n  <li>تعرف على الثقافة الألمانية والقوانين المحلية لتجنب المشاكل.</li>\n</ul>\n\n<h2>الخاتمة</h2>\n<p>تجربة الدراسة في ألمانيا كانت من أفضل القرارات التي اتخذتها في حياتي. رغم التحديات والصعوبات التي واجهتها، إلا أنني اكتسبت معرفة أكاديمية قيمة، وتعلمت لغة جديدة، وتعرفت على ثقافات متنوعة، وكونت صداقات من مختلف أنحاء العالم. أنصح جميع الطلاب الذين يفكرون في الدراسة بالخارج بالتفكير جدياً في ألمانيا كوجهة دراسية مميزة.</p>\n	اقرأ عن تجربة حقيقية للدراسة في ألمانيا. تعرف على مراحل التقديم، تكاليف المعيشة، النظام التعليمي والتحديات التي قد تواجهها كطالب دولي.	my-study-experience-in-germany	1	published	2025-05-01 19:29:59.032848	2025-05-01 19:29:59.032848
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.comments (id, content, post_id, author_id, created_at) FROM stdin;
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.countries (id, name, slug) FROM stdin;
1	المملكة المتحدة	uk
2	الولايات المتحدة الأمريكية	usa
3	ألمانيا	germany
4	كندا	canada
5	أستراليا	australia
6	اليابان	japan
7	فرنسا	france
\.


--
-- Data for Name: db_config; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.db_config (id, host, port, database, username, password, orm, auto_sync_frontend, auto_sync_admin, sync_interval, updated_at) FROM stdin;
\.


--
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.levels (id, name, slug) FROM stdin;
1	بكالوريوس	bachelors
2	ماجستير	masters
3	دكتوراه	phd
4	زمالة بحثية	research-fellowship
5	دورات قصيرة	short-courses
6	دبلوم	diploma
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pages (id, title, slug, content, meta_title, meta_description, is_published, show_in_header, show_in_footer, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: post_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.post_categories (id, post_id, category_id) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tags (id, name, slug) FROM stdin;
\.


--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.post_tags (id, post_id, tag_id) FROM stdin;
\.


--
-- Data for Name: scholarships; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.scholarships (id, title, slug, description, deadline, amount, is_featured, is_fully_funded, country_id, level_id, category_id, requirements, application_link, image_url, created_at, updated_at) FROM stdin;
1	h	h	H			t	f	\N	\N	\N				2025-05-01 19:21:30.742431+00	2025-05-01 19:21:30.742431+00
2	منحة جامعة أكسفورد للطلاب الدوليين	oxford-international-scholarship	منحة كاملة للدراسة في جامعة أكسفورد بالمملكة المتحدة في مختلف التخصصات	2025-12-15	تغطية كاملة للرسوم الدراسية	t	t	1	2	5	معدل مرتفع، إجادة اللغة الإنجليزية	https://www.ox.ac.uk/scholarships	\N	2025-05-01 19:27:15.902802+00	2025-05-01 19:27:15.902802+00
3	منحة فولبرايت للدراسات العليا	fulbright-graduate-scholarship	منحة دراسية للماجستير والدكتوراه في الجامعات الأمريكية	2025-09-30	30000$ سنويًا	t	t	2	3	3	شهادة بكالوريوس، توفل 90+	https://fulbright.org/apply	\N	2025-05-01 19:27:15.902802+00	2025-05-01 19:27:15.902802+00
4	منحة DAAD الألمانية	daad-scholarship	منحة للدراسة في الجامعات الألمانية للبكالوريوس والماجستير	2025-10-20	900 يورو شهريًا	t	f	3	2	1	معدل جيد جدًا، مستوى لغة ألمانية جيد	https://www.daad.de/en/	\N	2025-05-01 19:27:15.902802+00	2025-05-01 19:27:15.902802+00
5	منحة جامعة طوكيو	tokyo-university-scholarship	منحة للدراسة في تخصصات العلوم والتكنولوجيا في جامعة طوكيو	2025-08-15	تغطية 80% من الرسوم الدراسية	f	f	6	2	4	معدل 3.5 من 4، إجادة اللغة اليابانية أو الإنجليزية	https://www.u-tokyo.ac.jp/en/prospective-students/	\N	2025-05-01 19:27:15.902802+00	2025-05-01 19:27:15.902802+00
6	منحة جامعة تورنتو	toronto-university-scholarship	منحة للطلاب المتفوقين للدراسة في جامعة تورنتو	2025-11-10	25000$ كندي	f	f	4	1	2	معدل ممتاز، توصيات أكاديمية	https://www.utoronto.ca/scholarships	\N	2025-05-01 19:27:15.902802+00	2025-05-01 19:27:15.902802+00
\.


--
-- Data for Name: seo_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.seo_settings (id, page_path, meta_title, meta_description, og_image, keywords) FROM stdin;
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.site_settings (id, site_name, site_tagline, site_description, favicon, logo, logo_dark, email, phone, whatsapp, address, facebook, twitter, instagram, linkedin, youtube, primary_color, secondary_color, accent_color, enable_dark_mode, rtl_direction, default_language, enable_newsletter, enable_scholarship_search, footer_text, show_hero_section, hero_title, hero_subtitle, custom_css, show_featured_scholarships, show_search_section, show_categories_section, show_countries_section, show_latest_articles, show_success_stories, show_newsletter_section, show_statistics_section, show_partners_section, hero_description, featured_scholarships_title, featured_scholarships_description, categories_section_title, categories_section_description, countries_section_title, countries_section_description, latest_articles_title, latest_articles_description, success_stories_title, success_stories_description, newsletter_section_title, newsletter_section_description, statistics_section_title, statistics_section_description, partners_section_title, partners_section_description, home_page_layout, scholarship_page_layout, article_page_layout) FROM stdin;
1	FULLSCO	هلت	A platform to find and apply for scholarships around the world	\N	\N	\N	info@fullsco.com	90876	875443	Hhjjii	https://Facebook.com/fullsco	\N	\N	\N	\N	#3b82f6	#ff0000	#ff0000	f	t	ar	t	t	© 2025 FULLSCO. جميع الحقوق محفوظة.	t	Find 	Search thousands of scholarships worldwide	\N	t	t	t	t	t	t	t	t	t	أكبر قاعدة بيانات للمنح الدراسية حول العالم	منح دراسية مميزة	أبرز المنح الدراسية المتاحة حالياً	تصفح حسب التخصص	اختر المنح المناسبة حسب مجال دراستك	تصفح حسب البلد	اكتشف المنح الدراسية في بلدان مختلفة	أحدث المقالات	تعرف على آخر النصائح والمعلومات	قصص نجاح	تجارب حقيقية للطلاب الذين حصلوا على منح دراسية	النشرة البريدية	اشترك ليصلك كل جديد عن المنح الدراسية	إحصائيات	أرقام عن المنح الدراسية والطلاب حول العالم	شركاؤنا	المؤسسات والجامعات التي نتعاون معها	default	default	default
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscribers (id, email, name, created_at) FROM stdin;
\.


--
-- Data for Name: success_stories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.success_stories (id, name, title, slug, content, image_url, scholarship_name, created_at) FROM stdin;
1	أحمد محمد	رحلتي للحصول على منحة فولبرايت	fulbright-scholarship-journey	\n<p>مرحباً بكم جميعاً! أنا أحمد، طالب دكتوراه حالياً في جامعة هارفارد بالولايات المتحدة الأمريكية. أود أن أشارككم قصتي في الحصول على منحة فولبرايت، وكيف غيرت هذه المنحة مسار حياتي الأكاديمية والمهنية.</p>\n\n<h3>البداية</h3>\n<p>بدأت رحلتي عندما كنت في السنة الأخيرة من دراستي للماجستير. كنت أطمح لمتابعة الدكتوراه في الخارج، لكن التكاليف الباهظة كانت عائقاً كبيراً. بعد بحث مكثف، وجدت أن منحة فولبرايت هي أحد أفضل الخيارات المتاحة للطلاب الذين يرغبون في الدراسة في الولايات المتحدة.</p>\n\n<h3>التحضير والتقديم</h3>\n<p>بدأت التحضير قبل موعد التقديم بحوالي 6 أشهر. قمت بتحسين لغتي الإنجليزية وخضت امتحان التوفل وحصلت على درجة 110/120. كما عملت على تحسين سيرتي الذاتية من خلال المشاركة في مشاريع بحثية وأنشطة تطوعية. الجزء الأصعب كان كتابة رسالة الدافع والمشروع البحثي. استغرقت مني عدة أسابيع لكتابة رسالة دافع مقنعة تبرز شغفي بمجال تخصصي وأهدافي المستقبلية.</p>\n\n<h3>المقابلة الشخصية</h3>\n<p>بعد اجتياز المرحلة الأولى من التقييم، تمت دعوتي للمقابلة الشخصية. كانت المقابلة تحدياً كبيراً، حيث واجهت أسئلة دقيقة حول مشروعي البحثي وخططي المستقبلية. نصيحتي للمتقدمين: كونوا صادقين، وأظهروا شغفكم الحقيقي، واستعدوا جيداً للإجابة عن أسئلة متنوعة.</p>\n\n<h3>فترة الانتظار والقبول</h3>\n<p>انتظرت حوالي 3 أشهر للحصول على النتيجة النهائية. كانت فترة مليئة بالتوتر والترقب. وأخيراً، تلقيت بريداً إلكترونياً يخبرني بأنني حصلت على المنحة! كانت لحظة لا تنسى في حياتي.</p>\n\n<h3>تجربتي في الدراسة بالولايات المتحدة</h3>\n<p>بدأت دراستي في جامعة هارفارد قبل عامين. كانت التجربة ثرية ومليئة بالتحديات والفرص. تعرفت على ثقافات متنوعة، وتعلمت من أساتذة عالميين، وشاركت في مؤتمرات دولية. المنحة لم توفر لي فقط الدعم المالي، بل فتحت لي أبواباً جديدة للتعاون والنمو الأكاديمي.</p>\n\n<h3>نصائحي للمتقدمين</h3>\n<p>للطلاب الذين يطمحون للحصول على منحة فولبرايت، أقدم لكم النصائح التالية:</p>\n<ul>\n  <li>ابدأوا التحضير مبكراً، قبل 6 أشهر على الأقل من موعد التقديم.</li>\n  <li>اهتموا بتحسين مهاراتكم اللغوية، فهي عامل أساسي في التقييم.</li>\n  <li>اكتبوا رسالة دافع صادقة ومقنعة تعكس شخصيتكم وأهدافكم.</li>\n  <li>طوروا فكرة بحثية أصيلة وذات صلة باحتياجات بلدكم.</li>\n  <li>استشيروا الحاصلين على المنحة سابقاً واستفيدوا من تجاربهم.</li>\n</ul>\n\n<h3>كلمة أخيرة</h3>\n<p>منحة فولبرايت غيرت حياتي وفتحت لي آفاقاً جديدة لم أكن لأتخيلها. إذا كنت تطمح للدراسة في الخارج، لا تتردد في السعي للحصول على هذه الفرصة الرائعة. مع العمل الجاد والتخطيط الجيد، يمكنك تحقيق حلمك.</p>\n	\N	منحة فولبرايت للدراسات العليا	2025-05-01 19:32:49.247278+00
2	سارة أحمد	من حلم إلى واقع: دراستي في ألمانيا	dream-to-reality-studying-in-germany	\n<p>مرحباً! أنا سارة من مصر، وأود مشاركتكم قصة نجاحي في الحصول على منحة DAAD للدراسة في ألمانيا، وكيف تمكنت من تحويل حلمي إلى حقيقة.</p>\n\n<h3>حلم البداية</h3>\n<p>منذ طفولتي وأنا أحلم بالدراسة في الخارج، خاصة في ألمانيا لما تتميز به من نظام تعليمي متطور. بعد إنهاء دراستي الجامعية في مجال الهندسة المعمارية، بدأت البحث عن فرص للدراسة في الخارج.</p>\n\n<h3>اكتشاف منحة DAAD</h3>\n<p>تعرفت على منحة DAAD من خلال صديق درس في ألمانيا. قمت بزيارة موقع DAAD واكتشفت أنهم يقدمون منحاً دراسية متنوعة للطلاب الدوليين. وجدت أن برنامج الماجستير في "التصميم المستدام" يناسب اهتماماتي وخلفيتي الأكاديمية.</p>\n\n<h3>التحضير والتقديم</h3>\n<p>بدأت رحلة التحضير التي استمرت لمدة عام كامل. أولاً، قمت بتعلم اللغة الألمانية حتى وصلت لمستوى B1. ثم بدأت في تجهيز المستندات المطلوبة: شهادة البكالوريوس، كشف الدرجات، رسالة الدافع، ملف أعمالي، خطابات التوصية، وشهادة اللغة.</p>\n\n<p>الجزء الأكثر تحدياً كان إعداد ملف أعمالي (Portfolio) الذي يعرض مشاريعي ومهاراتي في التصميم. استغرق مني الأمر 3 أشهر لإعداد ملف احترافي يعكس رؤيتي وأسلوبي في التصميم.</p>\n\n<h3>القبول في المنحة</h3>\n<p>بعد تقديم جميع المستندات، انتظرت 4 أشهر قبل أن أتلقى رسالة القبول. كان يوماً لا يُنسى عندما فتحت بريدي الإلكتروني ووجدت رسالة تخبرني بحصولي على منحة DAAD الكاملة للدراسة في جامعة شتوتغارت!</p>\n\n<h3>الحياة والدراسة في ألمانيا</h3>\n<p>وصلت إلى ألمانيا قبل ثلاث سنوات وبدأت رحلة جديدة من التعلم والاكتشاف. الدراسة في ألمانيا تختلف كثيراً عن نظام التعليم في بلدي. هناك تركيز أكبر على البحث العلمي والتفكير النقدي والعمل الجماعي.</p>\n\n<p>واجهت بعض التحديات في البداية، خاصة مع اللغة وثقافة البلد الجديدة، لكنني تمكنت من التأقلم بسرعة بفضل برامج الدعم التي تقدمها الجامعة والمنحة.</p>\n\n<h3>الفرص والإنجازات</h3>\n<p>خلال دراستي، شاركت في العديد من المشاريع البحثية والمسابقات الدولية. فزت بجائزة أفضل مشروع تصميم مستدام في مسابقة أوروبية، وتم نشر بحثي في مجلة علمية مرموقة. كما قمت بالتدريب في شركة هندسية ألمانية رائدة، مما أثرى خبرتي العملية.</p>\n\n<h3>نصائح للطلاب</h3>\n<p>بناءً على تجربتي، أقدم النصائح التالية للطلاب الراغبين في الدراسة في ألمانيا:</p>\n<ul>\n  <li>ابدأوا في تعلم اللغة الألمانية مبكراً، حتى لو كان البرنامج باللغة الإنجليزية.</li>\n  <li>ابحثوا جيداً عن البرامج والجامعات التي تناسب اهتماماتكم وخلفيتكم الأكاديمية.</li>\n  <li>حضّروا ملفاً قوياً يبرز إنجازاتكم ومهاراتكم.</li>\n  <li>تواصلوا مع طلاب حاليين أو خريجين من البرنامج الذي ترغبون في الالتحاق به.</li>\n  <li>كونوا مستعدين للتكيف مع نظام تعليمي ونمط حياة مختلف.</li>\n</ul>\n\n<h3>الخاتمة</h3>\n<p>الآن، بعد تخرجي، حصلت على وظيفة في مكتب معماري ألماني متخصص في التصميم المستدام. منحة DAAD لم تغير مساري الأكاديمي فحسب، بل غيرت حياتي بالكامل. إذا كان لديكم حلم، اسعوا جاهدين لتحقيقه، وتذكروا أن الجهد والمثابرة هما مفتاح النجاح.</p>\n	\N	منحة DAAD للدراسة في ألمانيا	2025-05-01 19:33:23.4186+00
3	محمد خالد	كيف حصلت على منحة شيفنينج للدراسة في بريطانيا	how-i-got-chevening-scholarship	\n<p>مرحباً! أنا محمد، حاصل على منحة شيفنينج البريطانية للعام الدراسي 2022-2023. أود مشاركتكم تجربتي في الحصول على هذه المنحة المرموقة وكيف كانت هذه التجربة نقطة تحول في حياتي.</p>\n\n<h3>البداية والتحضير</h3>\n<p>كنت أعمل في مجال الإعلام والاتصال لمدة ثلاث سنوات بعد تخرجي من الجامعة، وكنت أطمح لتطوير مهاراتي ومعرفتي في هذا المجال. بحثت عن برامج الماجستير في المملكة المتحدة وانجذبت للبرامج التي تجمع بين الإعلام الرقمي والاتصال الاستراتيجي.</p>\n\n<p>بدأت التحضير للتقديم لمنحة شيفنينج قبل فتح باب التقديم بـ 4 أشهر. قرأت عن المنحة، وتواصلت مع طلاب سابقين، وحضرت ورش عمل تعريفية. كما قمت بتحسين لغتي الإنجليزية وحصلت على شهادة IELTS بدرجة 7.5.</p>\n\n<h3>عملية التقديم</h3>\n<p>قضيت وقتاً طويلاً في اختيار الجامعات والبرامج المناسبة. اخترت ثلاث جامعات: LSE، كينجز كوليدج لندن، وجامعة إدنبرة، جميعها في تخصص الإعلام والاتصال.</p>\n\n<p>الجزء الأصعب كان كتابة المقالات الأربعة المطلوبة للمنحة:</p>\n<ol>\n  <li>لماذا اخترت هذه البرامج الدراسية؟</li>\n  <li>كيف ستساعدك الدراسة في المملكة المتحدة على تحقيق طموحاتك المهنية المستقبلية؟</li>\n  <li>كيف ستساهم في تطوير بلدك بعد انتهاء البرنامج؟</li>\n  <li>لماذا تعتبر نفسك مرشحاً مناسباً لمنحة شيفنينج؟</li>\n</ol>\n\n<p>كل مقال كان يجب أن يكون في حدود 500 كلمة. قضيت أسابيع في كتابة هذه المقالات ومراجعتها مع زملاء وأصدقاء حتى وصلت للصيغة النهائية التي توضح رؤيتي وأهدافي بشكل واضح ومقنع.</p>\n\n<h3>المقابلة الشخصية</h3>\n<p>بعد عدة أشهر من التقديم، تلقيت دعوة للمقابلة الشخصية. كانت المقابلة عبر الإنترنت مع لجنة مكونة من ثلاثة أشخاص. استمرت المقابلة 45 دقيقة وتضمنت أسئلة عن خلفيتي الأكاديمية والمهنية، وأسباب اختياري للبرامج والجامعات، وكيف سأستفيد من الخبرة في المملكة المتحدة، وكيف سأساهم في تطوير بلدي بعد العودة.</p>\n\n<p>نصيحتي للمقابلة: كونوا أنفسكم، تحدثوا بثقة، واستعدوا جيداً للأسئلة المتوقعة. أظهروا فهمكم للقيم التي تبحث عنها منحة شيفنينج: القيادة، التأثير، بناء العلاقات.</p>\n\n<h3>القبول والتحضير للسفر</h3>\n<p>بعد ثلاثة أشهر من المقابلة، تلقيت رسالة القبول في المنحة! كان من أسعد أيام حياتي. بدأت مرحلة جديدة من التحضير: الحصول على القبول النهائي من الجامعة، استخراج التأشيرة، تجهيز الأوراق المطلوبة للمنحة، وترتيب السكن.</p>\n\n<h3>تجربة الدراسة في المملكة المتحدة</h3>\n<p>درست ماجستير الإعلام والاتصال في كينجز كوليدج لندن، وكانت تجربة ثرية ومليئة بالتحديات. التعليم في بريطانيا يعتمد بشكل كبير على البحث الذاتي والقراءة المكثفة والتفكير النقدي. المحاضرات والندوات كانت تفاعلية وتشجع على المناقشة وتبادل الآراء.</p>\n\n<p>بالإضافة إلى الدراسة الأكاديمية، قدمت منحة شيفنينج برنامجاً للقيادة والتطوير المهني، بما في ذلك ورش عمل، زيارات ميدانية، وفعاليات تواصل. تعرفت على طلاب متميزين من جميع أنحاء العالم وبنيت شبكة علاقات قوية.</p>\n\n<h3>ما بعد المنحة</h3>\n<p>بعد التخرج، عدت إلى بلدي وبدأت العمل في مؤسسة إعلامية كبيرة كمدير للاتصال الاستراتيجي. أستخدم المهارات والمعرفة التي اكتسبتها في المملكة المتحدة لتطوير استراتيجيات الاتصال وبناء علاقات مع المؤسسات الإعلامية العالمية.</p>\n\n<p>كما أقوم بتنظيم ورش عمل للشباب المهتمين بمجال الإعلام، وأشارك خبرتي مع المتقدمين لمنحة شيفنينج من خلال جلسات توجيهية.</p>\n\n<h3>نصائح للمتقدمين</h3>\n<ul>\n  <li>ابدأوا التحضير مبكراً واقرأوا عن المنحة بشكل مفصل.</li>\n  <li>اختاروا برامج ذات صلة قوية بخلفيتكم وأهدافكم المستقبلية.</li>\n  <li>اكتبوا مقالات صادقة ومقنعة تعكس شخصيتكم ورؤيتكم.</li>\n  <li>تواصلوا مع طلاب سابقين للاستفادة من تجاربهم.</li>\n  <li>استعدوا جيداً للمقابلة الشخصية وتدربوا على إجابة الأسئلة المتوقعة.</li>\n  <li>أظهروا كيف ستساهمون في تطوير بلدكم بعد العودة من المنحة.</li>\n</ul>\n\n<h3>الخاتمة</h3>\n<p>منحة شيفنينج غيرت مسار حياتي المهنية والشخصية. ليس فقط من خلال الدراسة الأكاديمية، بل من خلال التجربة الثقافية الثرية والفرص التي أتاحتها لي. إذا كنت تفكر في التقديم، أشجعك على خوض هذه التجربة المميزة. مع الإعداد الجيد والعزيمة، يمكنك تحقيق حلمك والحصول على هذه المنحة المرموقة.</p>\n	\N	منحة شيفنينج البريطانية	2025-05-01 19:34:07.892963+00
\.


--
-- Data for Name: sync_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sync_logs (id, type, source, destination, status, message, created_at) FROM stdin;
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.countries_id_seq', 7, true);


--
-- Name: db_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.db_config_id_seq', 1, false);


--
-- Name: levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.levels_id_seq', 6, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pages_id_seq', 1, false);


--
-- Name: post_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.post_categories_id_seq', 1, false);


--
-- Name: post_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.post_tags_id_seq', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.posts_id_seq', 4, true);


--
-- Name: scholarships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.scholarships_id_seq', 6, true);


--
-- Name: seo_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.seo_settings_id_seq', 1, false);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1, true);


--
-- Name: subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.subscribers_id_seq', 1, false);


--
-- Name: success_stories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.success_stories_id_seq', 3, true);


--
-- Name: sync_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sync_logs_id_seq', 1, false);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

