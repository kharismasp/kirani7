/* Kirani Next Lesson — complete approved Phase 3 lesson content. */
(function(){
  'use strict';

  window.KIRANI_LESSON_DATA = {
    sections: {
      warmup: [
        {
          id:'W1', tag:'WARMING UP · CONTEXTUAL BODMAS', title:'Build the total, then remove', type:'compound',
          story:'Seven boxes contain 18 pencils each. 25 pencils are given away. How many pencils remain?',
          parts:[
            {type:'expression', key:'expr', label:'1 · Build the math', prompt:'Expression', answer:'7*18-25', dimension:'structure'},
            {type:'numeric', key:'answer', label:'2 · Solve', prompt:'Pencils remaining', answer:101, unit:'pencils', dimension:'calculation'}
          ],
          hints:['How many pencils are there before any are given away?','Find 7 × 18 first, then subtract 25.'],
          structureFeedback:'Build the total in all 7 boxes before removing the pencils.',
          success:'Good structure. 101 pencils remain.'
        },
        {
          id:'W2', tag:'WARMING UP · THREE-STEP STORY', title:'Put the story events in mathematical order', type:'compound',
          story:'Six trays contain 24 items each. 18 items are removed. The remainder is shared equally among 7 groups. How many items does each group receive?',
          parts:[
            {type:'eventOrder', key:'route', label:'1 · Order the events', prompt:'Build the route.', events:['Share the remainder among 7 groups','Make the total from 6 trays','Remove 18 items'], answer:[1,2,0], dimension:'structure'},
            {type:'expression', key:'expr', label:'2 · Build the expression', prompt:'Expression', answer:'(6*24-18)/7', dimension:'structure'},
            {type:'numeric', key:'answer', label:'3 · Calculate', prompt:'Items per group', answer:18, dimension:'calculation'}
          ],
          hints:['The sharing happens after the items are removed.','First make the total, then subtract 18, then divide by 7.'],
          structureFeedback:'Check the story sequence: total first, then remove, then share.',
          success:'Route found. Each group receives 18 items.'
        },
        {
          id:'W3', tag:'WARMING UP · RELEVANT INFORMATION', title:'Which number actually matters?', type:'compound',
          story:'A library has 5 shelves with 16 books on each shelf. The reading room has 4 windows. 23 books are borrowed. How many books remain on the shelves?',
          parts:[
            {type:'irrelevant', key:'clue', label:'1 · Select the unnecessary clue', prompt:'Which clue does not affect the number of books?', clues:['5 shelves','16 books on each shelf','The reading room has 4 windows','23 books are borrowed'], answer:2, dimension:'structure'},
            {type:'expression', key:'expr', label:'2 · Build the math', prompt:'Expression', answer:'5*16-23', dimension:'structure'},
            {type:'numeric', key:'answer', label:'3 · Solve', prompt:'Books remaining', answer:57, unit:'books', dimension:'calculation'}
          ],
          hints:['Does the number of windows change the number of books?','Use only shelves, books per shelf, and borrowed books.'],
          structureFeedback:'Focus on the target: the number of books remaining.',
          success:'Good filtering. 57 books remain.'
        },
        {
          id:'W4', tag:'WARMING UP · EXPRESSION ONLY', title:'Build the math — do not solve', type:'tokenBuilder',
          intro:'DO NOT SOLVE. Build the mathematical expression only.',
          prompt:'Nine packets contain 14 cards each. 18 cards are given away. The remaining cards are shared equally among 6 students.',
          tokens:['9','×','14','−','18','÷','6','(',')'], answer:'(9*14-18)/6', dimension:'structure',
          hints:['What happens to the total before the sharing?','Total cards → subtract 18 → divide the remainder by 6.'],
          success:'Expression built correctly. Stop here — this task is expression only.'
        }
      ],

      lesson: [
        {
          id:'A1', pairId:'pair-relevance', part:'part1', tab:'Part 1 · Story & TKA', tag:'GUIDED ↔ TRY YOURSELF', title:'Relevant vs irrelevant information', type:'pair',
          guided:{
            title:'Guided Example · Find what matters',
            story:'A shop has 8 shelves. Each shelf contains 24 bottles. Each bottle costs Rp6.000. During the day, 37 bottles are sold. How many bottles remain?',
            ask:'How many bottles remain?', model:'8 × 24 − 37',
            steps:['The question asks for a number of bottles, so the price Rp6.000 is irrelevant.','Find the starting number of bottles: 8 × 24 = 192.','Remove the 37 sold bottles: 192 − 37 = 155.'],
            answer:'155 bottles'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            story:'For an art activity, 7 trays are prepared with 18 beads on each tray. The activity is held in Room 12. During the activity, 29 beads are used. How many beads remain?',
            parts:[
              {type:'irrelevant', key:'clue', label:'1 · Find the unnecessary information', prompt:'Which clue does not affect the number of beads?', clues:['7 trays','18 beads on each tray','The activity is held in Room 12','29 beads are used'], answer:2, dimension:'structure'},
              {type:'expression', key:'expr', label:'2 · Build the model', prompt:'Expression', answer:'7*18-29', dimension:'structure'},
              {type:'numeric', key:'answer', label:'3 · Calculate', prompt:'Beads remaining', answer:97, unit:'beads', dimension:'calculation'}
            ],
            structureFeedback:'Look at the Guided Example: first decide which number does not affect the quantity being asked.'
          },
          hints:['Which number tells you location rather than quantity?','Ignore Room 12. Find all beads first, then remove 29.'],
          success:'Good structure. You selected only the information needed and found the remaining beads.'
        },
        {
          id:'A2', pairId:'pair-reverse', part:'part1', tab:'Part 1 · Story & TKA', tag:'GUIDED ↔ TRY YOURSELF', title:'Reverse / missing quantity', type:'pair',
          guided:{
            title:'Guided Example · Rebuild the original amount',
            story:'Six boxes originally contained the same number of pencils. After 18 pencils were distributed, 102 pencils remained. How many pencils were originally in each box?',
            ask:'Original number of pencils per box', model:'(102 + 18) ÷ 6',
            steps:['102 is the amount after 18 pencils were removed.','Undo the removal to rebuild the original total: 102 + 18 = 120.','The original 120 pencils were split equally among 6 boxes: 120 ÷ 6 = 20.'],
            answer:'20 pencils per box'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            story:'Eight cartons originally held the same number of notebooks. After 24 notebooks were donated, 152 notebooks remained. How many notebooks were originally in each carton?',
            parts:[
              {type:'eventOrder', key:'route', label:'1 · Build the reverse route', prompt:'Which mathematical moves recover the original amount?', events:['Divide the original total by 8','Add the 24 donated notebooks back'], answer:[1,0], dimension:'structure'},
              {type:'expression', key:'expr', label:'2 · Build the model', prompt:'Expression', answer:'(152+24)/8', dimension:'structure'},
              {type:'numeric', key:'answer', label:'3 · Calculate', prompt:'Notebooks per carton', answer:22, dimension:'calculation'}
            ],
            structureFeedback:'Compare with the Guided Example. Rebuild the original total before dividing among the equal cartons.'
          },
          hints:['The 152 notebooks are what remain, not the original total.','Undo the donation first: add 24 back, then divide by 8.'],
          success:'Reverse route found. The original cartons held 22 notebooks each.'
        },
        {
          id:'A3', pairId:'pair-target', part:'part1', tab:'Part 1 · Story & TKA', tag:'GUIDED ↔ TRY YOURSELF', title:'Same context, different target', type:'pair',
          guided:{
            title:'Guided Set · Let the target choose the route',
            story:'There are 8 boxes. Each box contains 24 snacks. 36 snacks are distributed equally among 6 teachers.',
            ask:'Three different targets from one information card', model:'Target A: 8×24 · Target B: 36÷6 · Target C: 8×24−36',
            steps:['Initial total: 8 × 24 = 192 snacks.','Distributed amount per teacher: 36 ÷ 6 = 6 snacks.','Amount remaining: 8 × 24 − 36 = 156 snacks.','Same story does not mean the same route: read the target before choosing the operation.'],
            answer:'A = 192 · B = 6 · C = 156'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            story:'There are 7 crates. Each crate contains 30 juice cartons. 56 cartons are distributed equally among 7 teams. Use the same information card for all three targets.',
            parts:[
              {type:'expression', key:'exprA', label:'Target A · Initial total', prompt:'Build the model', answer:'7*30', dimension:'structure'},
              {type:'numeric', key:'ansA', label:'Target A · Solve', prompt:'Cartons initially', answer:210, dimension:'calculation'},
              {type:'expression', key:'exprB', label:'Target B · Each team receives', prompt:'Build the model', answer:'56/7', dimension:'structure'},
              {type:'numeric', key:'ansB', label:'Target B · Solve', prompt:'Cartons per team', answer:8, dimension:'calculation'},
              {type:'expression', key:'exprC', label:'Target C · Amount remaining', prompt:'Build the model', answer:'7*30-56', dimension:'structure'},
              {type:'numeric', key:'ansC', label:'Target C · Solve', prompt:'Cartons remaining', answer:154, dimension:'calculation'}
            ],
            structureFeedback:'Read the target again: is it asking for the starting total, the shared amount, or the amount left?'
          },
          hints:['Read the question again: is it asking for the starting total, the shared amount, or the amount left?','Match each target to the Guided Set before calculating.'],
          success:'All three targets use the correct route. The same information can support different mathematics.'
        },
        {
          id:'A4', pairId:'pair-tka-statements', part:'part1', tab:'Part 1 · Story & TKA', tag:'GUIDED ↔ TRY YOURSELF', title:'TKA statement evaluation', type:'pair',
          guided:{
            title:'Guided Example · Evaluate the complete set',
            story:'Dalam kegiatan pembagian buku, Kelas A memiliki 24 siswa, Kelas B 30 siswa, dan Kelas C 26 siswa. Setiap siswa memperoleh 2 buku. Satu dus berisi 20 buku.',
            ask:'Tentukan Benar/Salah untuk seluruh pernyataan sebelum memeriksa jawaban.',
            model:'24+30+26=80 → ×2=160 → ÷20=8',
            steps:['A. Total siswa adalah 80 → BENAR.','B. Dibutuhkan 160 buku → BENAR.','C. Dibutuhkan 9 dus buku → SALAH, karena 160 ÷ 20 = 8 dus.'],
            answer:'A Benar · B Benar · C Salah'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            story:'Untuk kegiatan kelas, Kelas VI-A memiliki 28 siswa, VI-B 32 siswa, dan VI-C 28 siswa. Setiap siswa menerima 3 pensil. Satu kotak berisi 24 pensil.',
            parts:[
              {type:'tfMatrix', key:'matrix', label:'1 · Nilai semua pernyataan', prompt:'Jawab ketiga pernyataan sebelum Check.', statements:['Jumlah seluruh siswa adalah 88.','Jumlah pensil yang dibutuhkan adalah 264.','Sekolah membutuhkan 12 kotak pensil.'], answer:[true,true,false], dimension:'structure'},
              {type:'numeric', key:'evidence', label:'2 · Evidence', prompt:'Berapa kotak yang sebenarnya dibutuhkan?', answer:11, unit:'kotak', dimension:'calculation'}
            ],
            structureFeedback:'Check the complete chain: students → pencils → boxes.'
          },
          hints:['Jumlahkan siswa sebelum menghitung pensil.','Kemudian hitung total pensil dan bagi dengan 24.'],
          success:'Set pernyataan lengkap benar, dan evidence menunjukkan 11 kotak.'
        },
        {
          id:'A5', pairId:'pair-models', part:'part1', tab:'Part 1 · Story & TKA', tag:'GUIDED ↔ TRY YOURSELF', title:'Compare two mathematical models', type:'pair',
          guided:{
            title:'Guided Example · Which expression matches the story?',
            story:'Eight boxes contain 24 snacks each. 36 snacks are removed. The remainder is shared equally among 6 groups.',
            ask:'Choose the model that represents the story.', model:'Dina: (8×24−36)÷6 ✓ · Rani: 8×(24−36)÷6 ✗',
            steps:['The 36 snacks are removed once from the total of all 8 boxes, not from every box.','8 × 24 = 192.','192 − 36 = 156.','156 ÷ 6 = 26.'],
            answer:'Dina · 26 snacks per group'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            story:'Six trays contain 22 pastries each. 12 pastries are sold. The remainder is packed equally into 5 baskets.',
            parts:[
              {type:'compareModels', key:'model', label:'1 · Which model represents the story?', models:[{name:'Maya',expression:'(6 × 22 − 12) ÷ 5'},{name:'Nina',expression:'6 × (22 − 12) ÷ 5'}], answerModel:0, evidencePrompt:'What is wrong with Nina’s model?', evidenceOptions:[{value:'total',label:'12 pastries are sold from the total, not from each tray.'},{value:'each',label:'12 pastries are sold from every tray.'},{value:'sharefirst',label:'The pastries must be shared before finding the total.'}], answerEvidence:['total'], dimension:'structure'},
              {type:'numeric', key:'answer', label:'2 · Calculate the correct model', prompt:'Pastries per basket', answer:24, dimension:'calculation'}
            ],
            structureFeedback:'Ask whether 12 pastries are removed from each tray or once from the whole collection.'
          },
          hints:['Are 12 pastries removed from each tray or from the whole collection?','First form the total from all trays. Only then subtract 12.'],
          success:'Correct model, evidence, and calculation: 24 pastries per basket.'
        },
        {
          id:'G1', pairId:'pair-fence-gate', part:'geometry', tab:'Geometry · Design & Measurement', tag:'GUIDED ↔ TRY YOURSELF', title:'Fence + gate', type:'pair',
          guided:{
            title:'Guided Example · Complete boundary minus opening',
            story:'A rectangular garden is 12 m long and 8 m wide. A 2 m-wide gate is part of the boundary and does not need fencing. How much fencing is required?',
            ask:'Length of fencing required', model:'2(12 + 8) − 2',
            diagram:{lengthLabel:'12 m',widthLabel:'8 m',gate:2,gateLabel:'2 m gate'},
            steps:['Find the full perimeter: 2(12 + 8) = 40 m.','The 2 m gate replaces part of the fence.','40 − 2 = 38 m.'],
            answer:'38 m of fencing'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            story:'A rectangular playground is 15 m long and 9 m wide. A 3 m entrance is left open with no fence. How much fencing is needed?',
            parts:[
              {type:'geometry', key:'diagram', label:'Use the design', diagram:{lengthLabel:'15 m',widthLabel:'9 m',gate:3,gateLabel:'3 m entrance'}, fields:[{key:'fence',prompt:'Fencing required',unit:'m',answer:45,dimension:'calculation'}]},
              {type:'expression', key:'model', label:'Show the model', prompt:'Expression', answers:['2*(15+9)-3','2(15+9)-3'], dimension:'structure'}
            ],
            structureFeedback:'Start with the complete boundary, then account for the open entrance.'
          },
          hints:['First imagine the full boundary closed.','Find the full perimeter, then remove the open entrance length.'],
          success:'Design model correct. The playground needs 45 m of fencing.'
        },
        {
          id:'G2', pairId:'pair-uncovered-area', part:'geometry', tab:'Geometry · Design & Measurement', tag:'GUIDED ↔ TRY YOURSELF', title:'Covered / uncovered area', type:'pair',
          guided:{
            title:'Guided Example · Whole area minus covered area',
            story:'A room is 8 m by 6 m. A carpet measuring 4 m by 3 m covers part of the floor. How much floor remains uncovered?',
            ask:'Uncovered floor area', model:'8 × 6 − 4 × 3',
            diagram:{lengthLabel:'8 m',widthLabel:'6 m',shaded:true,shadedLabel:'4 m × 3 m carpet'},
            steps:['Room area: 8 × 6 = 48 m².','Carpet area: 4 × 3 = 12 m².','Uncovered area: 48 − 12 = 36 m².'],
            answer:'36 m²'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            story:'A studio floor is 10 m by 7 m. A mat measuring 5 m by 2 m covers part of it. How much floor remains uncovered?',
            parts:[
              {type:'geometry', key:'diagram', label:'Use the floor plan', diagram:{lengthLabel:'10 m',widthLabel:'7 m',shaded:true,shadedLabel:'5 m × 2 m mat'}, fields:[{key:'whole',prompt:'Whole floor area',unit:'m²',answer:70,dimension:'calculation'},{key:'covered',prompt:'Mat area',unit:'m²',answer:10,dimension:'calculation'},{key:'uncovered',prompt:'Uncovered area',unit:'m²',answer:60,dimension:'calculation'}]},
              {type:'expression', key:'model', label:'Build the model', prompt:'Expression for uncovered area', answers:['10*7-5*2','(10*7)-(5*2)'], dimension:'structure'}
            ],
            structureFeedback:'Use whole floor area minus covered area.'
          },
          hints:['You need two areas before subtracting.','Whole floor area minus mat area.'],
          success:'Whole, covered, and uncovered areas all match. 60 m² remains uncovered.'
        },
        {
          id:'G3', pairId:'pair-missing-dimension', part:'geometry', tab:'Geometry · Design & Measurement', tag:'GUIDED ↔ TRY YOURSELF', title:'Missing dimension → perimeter', type:'pair',
          guided:{
            title:'Guided Example · Find the missing side first',
            story:'A rectangular garden has area 72 m². Its length is 9 m. Find the width, then find the perimeter.',
            ask:'Width first, then perimeter', model:'72 ÷ 9 = 8 → 2(9 + 8) = 34',
            diagram:{lengthLabel:'9 m',widthLabel:'? m'},
            steps:['Use area = length × width, so width = 72 ÷ 9 = 8 m.','Now use the recovered width in the perimeter: 2(9 + 8) = 34 m.'],
            answer:'Width = 8 m · Perimeter = 34 m'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            story:'A rectangular display area has area 108 m². Its length is 12 m. Find the width, then find the perimeter.',
            parts:[
              {type:'geometry', key:'diagram', label:'Use the diagram', diagram:{lengthLabel:'12 m',widthLabel:'? m'}, fields:[{key:'width',prompt:'Width',unit:'m',answer:9,dimension:'structure'},{key:'perimeter',prompt:'Perimeter',unit:'m',answer:42,dimension:'calculation'}]},
              {type:'expression', key:'route', label:'Show the perimeter model', prompt:'Perimeter expression after finding the width', answers:['2*(12+9)','2(12+9)'], dimension:'structure'}
            ],
            structureFeedback:'Find the missing side from the area before working on the perimeter.'
          },
          hints:['Which multiplication gives area for a rectangle?','Undo length × width = area using division, then use the width in the perimeter.'],
          success:'Missing dimension recovered and perimeter completed: 9 m and 42 m.'
        },
        {
          id:'G4', part:'geometry', tab:'Geometry · Design & Measurement', tag:'OPTIONAL · COMPARE TWO DESIGNS', title:'Same fencing, different area', type:'compound',
          intro:'Optional transfer challenge: calculate before deciding.',
          story:'Garden A is 10 m × 6 m. Garden B is 8 m × 8 m. Compare their area and perimeter. Which design gives more area if both require the same amount of fencing?',
          parts:[
            {type:'numeric', key:'aArea', label:'Garden A', prompt:'Area', answer:60, unit:'m²', dimension:'calculation'},
            {type:'numeric', key:'aPerim', label:'Garden A', prompt:'Perimeter', answer:32, unit:'m', dimension:'calculation'},
            {type:'numeric', key:'bArea', label:'Garden B', prompt:'Area', answer:64, unit:'m²', dimension:'calculation'},
            {type:'numeric', key:'bPerim', label:'Garden B', prompt:'Perimeter', answer:32, unit:'m', dimension:'calculation'},
            {type:'compareModels', key:'decision', label:'Decision', models:[{name:'Garden A',expression:'10 m × 6 m'},{name:'Garden B',expression:'8 m × 8 m'}], answerModel:1, evidencePrompt:'Why?', evidenceOptions:[{value:'sameFence',label:'Both perimeters are 32 m, but Garden B has the larger area.'},{value:'shorter',label:'Garden B uses less fencing.'},{value:'sameArea',label:'Both gardens have the same area.'}], answerEvidence:['sameFence'], dimension:'structure'}
          ],
          hints:['Calculate both perimeters and both areas before making the decision.','The perimeters match; compare 60 m² and 64 m².'],
          success:'Garden B gives more area while both designs use 32 m of boundary.'
        },
        {
          id:'P1', pairId:'pair-powers', part:'part2', tab:'Part 2 · Powers → Algebra', tag:'GUIDED ↔ TRY YOURSELF', title:'Power means repeated multiplication', type:'pair', intro:'POWER → PATTERN → MYSTERY NUMBER → x. Each step grows naturally from the one before it.',
          guided:{
            title:'Guided Example · 3⁴', story:'Read 3⁴ as repeated multiplication.', ask:'What do the base and exponent tell us?', model:'3⁴ = 3 × 3 × 3 × 3',
            steps:['Base = 3. Exponent/index = 4.','The exponent tells us to multiply four copies of 3.','3×3=9, 9×3=27, 27×3=81.','3⁴ does NOT mean 3 × 4.'], answer:'3⁴ = 81'
          },
          try:{
            type:'compound', heading:'Try Yourself', story:'Expand and calculate 2⁵.',
            parts:[
              {type:'matching', key:'parts', label:'1 · Read the power', prompt:'Match each role to its value in 2⁵.', left:['Base','Exponent / index'], right:['5','2'], answer:{'0':1,'1':0}, dimension:'structure'},
              {type:'tokenBuilder', key:'expanded', label:'2 · Expanded form', prompt:'Build 2⁵ as repeated multiplication.', tokens:['2','×'], answer:'2*2*2*2*2', dimension:'structure'},
              {type:'numeric', key:'value', label:'3 · Value', prompt:'2⁵ =', answer:32, dimension:'calculation'}
            ],
            structureFeedback:'The base is the repeated number; the exponent tells how many copies are multiplied.'
          },
          hints:['The exponent tells you how many 2s are multiplied.','Write five 2s joined by multiplication signs.'],
          success:'Correct: 2⁵ is five 2s multiplied, giving 32.'
        },
        {
          id:'P2A', pairId:'pair-square-pattern', part:'part2', tab:'Part 2 · Powers → Algebra', tag:'GUIDED ↔ TRY YOURSELF', title:'Powers create visible patterns', type:'pair',
          guided:{
            title:'Guided Example · Square numbers', story:'1, 4, 9, 16, 25, ...', ask:'What is the next term, and how is it connected to powers?', model:'1², 2², 3², 4², 5², ...',
            steps:['Each term is the square of the next counting number.','After 5² comes 6².','6² = 36.'], answer:'36 = 6²'
          },
          try:{
            type:'compound', heading:'Try Yourself',
            parts:[
              {type:'pattern', key:'term', label:'1 · Complete the pattern', sequence:['9','16','25','36','?'], prompt:'Missing term', answer:49, dimension:'calculation'},
              {type:'matching', key:'powerMatch', label:'2 · Connect the term to its power', prompt:'Match the missing term to its square form.', left:['49'], right:['6²','7²','8²'], answer:{'0':1}, dimension:'structure'}
            ],
            structureFeedback:'Rewrite each visible term as a square, then continue the square-number sequence.'
          },
          hints:['Rewrite each visible term as a square.','After 6², what square comes next?'],
          success:'Pattern connected to powers: 49 = 7².'
        },
        {
          id:'P2B', pairId:'pair-powers-two', part:'part2', tab:'Part 2 · Powers → Algebra', tag:'GUIDED ↔ TRY YOURSELF', title:'A doubling pattern is also a power pattern', type:'pair',
          guided:{
            title:'Guided Example · Powers of 2', story:'2, 4, 8, 16, 32, ...', ask:'What is the rule and the next term?', model:'2¹, 2², 2³, 2⁴, 2⁵, ...',
            steps:['Multiply by 2 each time.','The exponent also increases by 1 each time.','The next term is 64 = 2⁶.'], answer:'64 = 2⁶'
          },
          try:{
            type:'compound', heading:'Try Yourself', story:'Continue: 4, 8, 16, 32, 64, ?',
            parts:[
              {type:'mystery', key:'ruleAndTerm', label:'1 · Rule and next term', equation:'4 → 8 → 16 → 32 → 64 → ?', prompt:'Choose the rule, then enter the next term.', routes:['Multiply by 2','Add 2','Square the previous term'], answerRoute:0, answer:128, answerPrompt:'Next term', routeDimension:'structure', answerDimension:'calculation'},
              {type:'expression', key:'power', label:'2 · Power form', prompt:'Write 128 as a power of 2', answers:['2^7','2⁷'], dimension:'structure'}
            ],
            structureFeedback:'Continue both the doubling pattern and the exponent count.'
          },
          hints:['Compare each term with the one before it.','Continue both the doubling pattern and the exponent count.'],
          success:'The pattern continues to 128 = 2⁷.'
        },
        {
          id:'P3A', pairId:'pair-pattern-missing', part:'part2', tab:'Part 2 · Powers → Algebra', tag:'GUIDED ↔ TRY YOURSELF', title:'Pattern → mystery number', type:'pair',
          guided:{
            title:'Guided Example · A missing term', story:'4, 8, 12, ?, 20', ask:'What rule connects the terms?', model:'Add 4 each time',
            steps:['4 → 8 adds 4.','8 → 12 also adds 4.','Continue the same rule: 12 + 4 = 16, then 16 + 4 = 20.'], answer:'Missing number = 16'
          },
          try:{
            type:'mystery', heading:'Try Yourself', equation:'10 → 15 → 20 → ? → 30', prompt:'Choose the rule, then find the mystery number.', routes:['Add 5 each time','Multiply by 5','Add 10 each time'], answerRoute:0, answer:25, answerPrompt:'Mystery number', routeDimension:'structure', answerDimension:'calculation'
          },
          hints:['Compare neighboring terms.','The same amount is added each time.'],
          success:'The constant-step pattern gives 25.'
        },
        {
          id:'P3B', pairId:'pair-number-sentence', part:'part2', tab:'Part 2 · Powers → Algebra', tag:'GUIDED ↔ TRY YOURSELF', title:'Mystery number in a number sentence', type:'pair',
          guided:{
            title:'Guided Example · Undo the operation', story:'3 × ? = 21', ask:'What number makes the statement true?', model:'21 ÷ 3 = 7',
            steps:['The mystery number is multiplied by 3.','Division undoes multiplication.','21 ÷ 3 = 7.'], answer:'? = 7'
          },
          try:{
            type:'mystery', heading:'Try Yourself', equation:'4 × ? = 32', prompt:'Choose the useful undo move, then find the mystery number.', routes:['Divide 32 by 4','Multiply 32 by 4','Subtract 4 from 32'], answerRoute:0, answer:8, answerPrompt:'Mystery number', routeDimension:'structure', answerDimension:'calculation'
          },
          hints:['Which operation undoes multiplication?','Divide 32 by 4.'],
          success:'The inverse move works: the mystery number is 8.'
        },
        {
          id:'P4', pairId:'pair-intro-algebra', part:'part2', tab:'Part 2 · Powers → Algebra', tag:'GUIDED ↔ TRY YOURSELF', title:'Mystery number → x', type:'pair',
          guided:{
            title:'Guided Example · The mystery number gets a symbol',
            story:'□ + 5 = 12, ? + 5 = 12, and x + 5 = 12 all describe the same idea: an unknown number. Now solve 2x + 3 = 13.',
            ask:'What number does x represent?', model:'2x + 3 = 13',
            steps:['x is simply a symbol for the number we do not know yet.','Undo +3 first: 13 − 3 = 10.','Now 2x = 10. Divide by 2: x = 5.','Check: 2(5) + 3 = 13.'],
            answer:'x = 5'
          },
          try:{
            type:'compound', heading:'Try Yourself', story:'Solve 3x + 4 = 22.',
            parts:[
              {type:'eventOrder', key:'undoRoute', label:'1 · Order the inverse moves', prompt:'Build the route that isolates x.', events:['Subtract 4 from 22','Divide the result by 3'], answer:[0,1], dimension:'structure'},
              {type:'numeric', key:'x', label:'2 · Solve', prompt:'x =', answer:6, dimension:'calculation'}
            ],
            structureFeedback:'Which operation happened to x last? Undo that first.'
          },
          hints:['Look at the Guided Example. Undo the added number first.','Subtract 4 from 22, then divide the result by 3.'],
          success:'x is the mystery number: x = 6.'
        }
      ],

      transfer: [
        {
          id:'IT1', tag:'INDEPENDENT TRANSFER · TKA', title:'Select, model, solve', type:'compound',
          story:'Sebuah panitia menyiapkan 5 kotak, masing-masing berisi 28 botol minum. Acara dimulai pukul 08.30. Sebanyak 20 botol rusak dan tidak dapat digunakan. Sisa botol dibagikan sama banyak kepada 6 kelompok. Berapa botol yang diterima setiap kelompok?',
          parts:[
            {type:'irrelevant', key:'clue', label:'1 · Informasi yang tidak diperlukan', prompt:'Pilih informasi yang tidak mengubah jumlah botol.', clues:['5 kotak','28 botol per kotak','Acara dimulai pukul 08.30','20 botol rusak','6 kelompok'], answer:2, dimension:'structure'},
            {type:'expression', key:'expr', label:'2 · Build the math', prompt:'Expression', answer:'(5*28-20)/6', dimension:'structure'},
            {type:'numeric', key:'answer', label:'3 · Solve', prompt:'Botol per kelompok', answer:20, unit:'botol', dimension:'calculation'}
          ],
          hints:['Which information changes the number of bottles?','Total bottles → remove damaged bottles → share the remainder.'],
          structureFeedback:'Focus on quantities that change the bottle count.',
          success:'Independent modelling complete: 20 bottles per group.'
        },
        {
          id:'IT2', tag:'INDEPENDENT TRANSFER · GEOMETRY', title:'Design the fencing route', type:'compound',
          story:'A rectangular garden is 14 m long and 10 m wide. A 4 m-wide opening is used as the entrance and needs no fence. How much fencing is required?',
          parts:[
            {type:'geometry', key:'diagram', label:'Use the design', diagram:{lengthLabel:'14 m',widthLabel:'10 m',gate:4,gateLabel:'4 m entrance'}, fields:[{key:'fence',prompt:'Fencing required',unit:'m',answer:44,dimension:'calculation'}]},
            {type:'expression', key:'expr', label:'Build the model', prompt:'Expression', answers:['2*(14+10)-4','2(14+10)-4'], dimension:'structure'}
          ],
          hints:['Find the complete perimeter first.','Subtract the unfenced entrance.'],
          structureFeedback:'Use the complete boundary, then remove the open entrance.',
          success:'Independent design transfer complete: 44 m of fencing.'
        },
        {
          id:'IT3', tag:'INDEPENDENT TRANSFER · POWERS & PATTERN', title:'Complete the square pattern', type:'pattern',
          intro:'No Guided Example is shown here.',
          sequence:['16','25','36','49','?'], prompt:'Missing term', answer:64, powerPrompt:'Write the missing term as a power', powerAnswer:'8^2', powerDimension:'structure', dimension:'calculation',
          hints:['Rewrite the visible terms as squares.','49 = 7²; continue to the next square.'],
          success:'Independent pattern transfer: 64 = 8².'
        },
        {
          id:'IT4', tag:'INDEPENDENT TRANSFER · INTRO ALGEBRA', title:'Solve the unknown', type:'mystery',
          intro:'No Guided Example is shown here.',
          equation:'4x + 7 = 31', prompt:'Choose the first inverse move, then solve for x.', routes:['Subtract 7','Divide by 4 immediately','Add 7'], answerRoute:0, answer:6, answerPrompt:'x =', routeDimension:'structure', answerDimension:'calculation',
          hints:['Undo the +7 first.','After subtracting 7, divide by 4.'],
          success:'Independent algebra transfer: x = 6.'
        }
      ]
    }
  };
})();
