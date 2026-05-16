// ────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────
const SK = 'kart_v1';
const VERSION = '3.1.0';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DEF_CATS = [
  {id:'c01',name:'CEREALS/CARBS',items:[
    {id:'i0101',name:'Atta'},{id:'i0102',name:'Besan'},{id:'i0103',name:'Maida'},
    {id:'i0104',name:'Poha Thick'},{id:'i0105',name:'Ragi Flour'},{id:'i0106',name:'Rava Bombay'},
    {id:'i0107',name:'Rava Chiroti'},{id:'i0108',name:'Rice - Basmati'},{id:'i0109',name:'Rice - Daily'},
    {id:'i0110',name:'Rice - Dosa'},{id:'i0111',name:'Rice - Idli'},{id:'i0112',name:'Rice - Jeera'},
    {id:'i0113',name:'Rice - Flour'},{id:'i0114',name:'Rice - Sevai'},{id:'i0115',name:'Rice - LowGI'},
    {id:'i0116',name:'Sabudana'},{id:'i0117',name:'Vermicilli'},{id:'i0118',name:'Idli batter'}]},
  {id:'c02',name:'PULSES/PROTEIN',items:[
    {id:'i0201',name:'Chana dal'},{id:'i0202',name:'Fried gram'},{id:'i0203',name:'Green peas matar'},
    {id:'i0204',name:'Kabuli chana brown'},{id:'i0205',name:'Kabuli chana white'},{id:'i0206',name:'Moong dal'},
    {id:'i0207',name:'Raw peanuts'},{id:'i0208',name:'Tur dal'},{id:'i0209',name:'Urad dal'},
    {id:'i0210',name:'Urad gota'},{id:'i0211',name:'White peas matar'},{id:'i0212',name:'Whole moong'}]},
  {id:'c03',name:'DAIRY',items:[
    {id:'i0301',name:'Milk'},{id:'i0302',name:'Paneer'},{id:'i0303',name:'Cheese'},
    {id:'i0304',name:'Peanut Butter'}]},
  {id:'c04',name:'SPICES',items:[
    {id:'i0401',name:'Aachi red chilli powder'},{id:'i0402',name:'Aamchur powder eastern'},
    {id:'i0403',name:'Ajwain'},{id:'i0404',name:'Black pepper powder'},{id:'i0405',name:'Black pepper whole'},
    {id:'i0406',name:'Black salt'},{id:'i0407',name:'Cinnamon'},{id:'i0408',name:'Clove'},
    {id:'i0409',name:'Coriander powder'},{id:'i0410',name:'Elaichi'},{id:'i0411',name:'Ginger garlic paste'},
    {id:'i0412',name:'Jeera'},{id:'i0413',name:'Kala namak'},{id:'i0414',name:'Kashmirilal chilli powder'},
    {id:'i0415',name:'Kasuri methi'},{id:'i0416',name:'Methi'},{id:'i0417',name:'MTR Garam masala'},
    {id:'i0418',name:'MTR Hing'},{id:'i0419',name:'Mustard small'},{id:'i0420',name:'Saunf'},
    {id:'i0421',name:'Tamarind whole'},{id:'i0422',name:'Turmeric powder'},{id:'i0423',name:'White til'},
    {id:'i0424',name:'Whole chilli'},{id:'i0425',name:'Cardamom'}]},
  {id:'c05',name:'FAT/OIL',items:[
    {id:'i0501',name:'Coconut oil'},{id:'i0502',name:'Ghee'},{id:'i0503',name:'Gingelly oil'},
    {id:'i0504',name:'Puja oil'},{id:'i0505',name:'Sunflower oil'}]},
  {id:'c06',name:'SALT',items:[
    {id:'i0601',name:'Crystal salt'},{id:'i0602',name:'Powder salt'}]},
  {id:'c07',name:'SUGAR',items:[
    {id:'i0701',name:'Sugar - Regular'},{id:'i0702',name:'Sugar - Low GI 33%'},
    {id:'i0703',name:'Sugar - Stevia'},{id:'i0704',name:'Jaggery powder'},{id:'i0705',name:'Jaggery round'}]},
  {id:'c08',name:'COFFEE & TEA',items:[
    {id:'i0801',name:'Coffee'},{id:'i0802',name:'Emperia tea'},{id:'i0803',name:'Taj mahal tea'}]},
  {id:'c09',name:'PAPAD',items:[
    {id:'i0901',name:'Ambica Papad #3'},{id:'i0902',name:'Ambica Papad #6'},
    {id:'i0903',name:'Chilli Papad Atish'},{id:'i0904',name:'Lijat papad'},
    {id:'i0905',name:'Onion fryums'},{id:'i0906',name:'Tomato papad'},{id:'i0907',name:'Popular papad'}]},
  {id:'c10',name:'SAUCE & JAM',items:[
    {id:'i1001',name:'Del monte ketchup'},{id:'i1002',name:'Jam'},
    {id:'i1003',name:'Pickle mango ginger'},{id:'i1004',name:'Pickle mango thokku'}]},
  {id:'c11',name:'READYMIX POWDER',items:[
    {id:'i1101',name:'GRB puliyogere powder'},{id:'i1102',name:'MTR bisibele bath powder'},
    {id:'i1103',name:'MTR puliyogere powder'},{id:'i1104',name:'MTR vangi bath powder'},
    {id:'i1105',name:'MTR Badam'},{id:'i1106',name:'Gulab jamoon powder'}]},
  {id:'c12',name:'DRYFRUIT',items:[
    {id:'i1201',name:'Almond'},{id:'i1202',name:'Cashew'},{id:'i1203',name:'Raisins'}]},
  {id:'c13',name:'TOILETRIES',items:[
    {id:'i1301',name:'Active salt toothpaste'},{id:'i1302',name:'Shaving blade'},
    {id:'i1303',name:'Closeup paste'},{id:'i1304',name:'Conditioner'},{id:'i1305',name:'Dettol body wash'},
    {id:'i1306',name:'Dove daily shine shampoo'},{id:'i1307',name:'Gillette foam'},
    {id:'i1308',name:'Gillette vector plus'},{id:'i1309',name:'Glow & lovely'},
    {id:'i1310',name:'Liquid concealer'},{id:'i1311',name:'Soap kojic aid'},{id:'i1312',name:'Toothbrush'},
    {id:'i1313',name:'Vivel body wash lavender'},{id:'i1314',name:'Boroplus'},{id:'i1315',name:'Neem soap'}]},
  {id:'c14',name:'CLEANING SUPPLIES',items:[
    {id:'i1401',name:'Clothes clips'},{id:'i1402',name:'Cockroach spray mortein'},
    {id:'i1403',name:'Cockroach vanish'},{id:'i1404',name:'Dettol antiseptic'},
    {id:'i1405',name:'Dishwasher'},{id:'i1406',name:'Drainex'},{id:'i1407',name:'Exo scrubber'},
    {id:'i1408',name:'Floor cleaner floral'},{id:'i1409',name:'Floor cleaner neem'},
    {id:'i1410',name:'Gala mop refill'},{id:'i1411',name:'Gala/safal steel scrubber'},
    {id:'i1412',name:'Garbage bags'},{id:'i1413',name:'Harpic toilet cleaner blue'},
    {id:'i1414',name:'Kitchen wiper'},{id:'i1415',name:'Mini rubber kitchen wiper'},
    {id:'i1416',name:'Mortein'},{id:'i1417',name:'Naphthalene'},{id:'i1418',name:'Odonil'},
    {id:'i1419',name:'Rin'},{id:'i1420',name:'Room freshner spray'},{id:'i1421',name:'Sabeena'},
    {id:'i1422',name:'Scotchbrite microfibre'},{id:'i1423',name:'Toilet cleaner brush'}]},
  {id:'c15',name:'VEGGIES',items:[
    {id:'i1501',name:'Amaranthus'},{id:'i1502',name:'Banana'},{id:'i1503',name:'Beans-Broad'},
    {id:'i1504',name:'Beans-French'},{id:'i1505',name:'Beetroot'},{id:'i1506',name:'Bhindi'},
    {id:'i1507',name:'Bitter gourd'},{id:'i1508',name:'Blueberry'},{id:'i1509',name:'Bottlegourd'},
    {id:'i1510',name:'Brinjal'},{id:'i1511',name:'Cabbage'},{id:'i1512',name:'Capsicum'},
    {id:'i1513',name:'Carrot'},{id:'i1514',name:'Cauliflower'},{id:'i1515',name:'Chilli'},
    {id:'i1516',name:'Chow chow'},{id:'i1517',name:'Cluster beans'},{id:'i1518',name:'Coconut'},
    {id:'i1519',name:'Colocasia'},{id:'i1520',name:'Coriander leaves'},{id:'i1521',name:'Cucumber'},
    {id:'i1522',name:'Curry leaves'},{id:'i1523',name:'Drumstick'},{id:'i1524',name:'French beans'},
    {id:'i1525',name:'Garlic'},{id:'i1526',name:'Ginger'},{id:'i1527',name:'Hybrid tomato'},
    {id:'i1528',name:'Lemon'},{id:'i1529',name:'Methi'},{id:'i1530',name:'Onion'},
    {id:'i1531',name:'Spinach'},{id:'i1532',name:'Parwal'},{id:'i1533',name:'Potato'},
    {id:'i1534',name:'Pumpkin'},{id:'i1535',name:'Radish'},{id:'i1536',name:'Ridge gourd'},
    {id:'i1537',name:'Snake gourd'},{id:'i1538',name:'Sweet potato'},{id:'i1539',name:'Tomato'}]},
  {id:'c16',name:'FRUITS',items:[
    {id:'i1601',name:'Pomegranate'},{id:'i1602',name:'Baby Banana'},{id:'i1603',name:'Assorted fruits'}]},
  {id:'c17',name:'MISCELLANEOUS',items:[
    {id:'i1701',name:'Maaza tetrapack'},{id:'i1702',name:'K Bomb top ramen noodles'},
    {id:'i1703',name:'French fries'},{id:'i1704',name:'Cheese macaroni pazta'},
    {id:'i1705',name:'Masala Penne pazta'},{id:'i1706',name:'Potato mixture falhari'},
    {id:'i1707',name:'Puran Poli ready to make'},{id:'i1708',name:'Kitkat'},
    {id:'i1709',name:'Tender coconut water'},{id:'i1710',name:'Chocohazelnut spread'},
    {id:'i1711',name:'Fresho sk chips'},{id:'i1712',name:'Seeds sk mix'},{id:'i1713',name:'Perk'},
    {id:'i1714',name:'Gems'},{id:'i1715',name:'Nipatu'},{id:'i1716',name:'Besan ladu'},
    {id:'i1717',name:'Salted peanuts'},{id:'i1718',name:'Strawberry milkshake'},
    {id:'i1719',name:'Dev Murukku'},{id:'i1720',name:'Walnut cake sk'},{id:'i1721',name:'Potato chiwda'},
    {id:'i1722',name:'Bread'},{id:'i1723',name:'Cadburys shots'},{id:'i1724',name:'Boondi'},
    {id:'i1725',name:'Nightlamp'},{id:'i1726',name:'Printout grocery list'},{id:'i1727',name:'Aux cable'},
    {id:'i1728',name:'Door mat'},{id:'i1729',name:'Scotch tape grey'},{id:'i1730',name:'Scotch scissor nonstick'},
    {id:'i1731',name:'Pen holder'},{id:'i1732',name:'Hooks'},{id:'i1733',name:'Printout'},
    {id:'i1734',name:'Spray bottle'},{id:'i1735',name:'Uniball'},{id:'i1736',name:'Kitchen tissue'},
    {id:'i1737',name:'Ratan bath towel'},{id:'i1738',name:'Card reader'},{id:'i1739',name:'Lata gift bowl'},
    {id:'i1740',name:'Lata gift bag'},{id:'i1741',name:'Ganesh gift charger'},
    {id:'i1742',name:'Usb C to A adapter'},{id:'i1743',name:'Door mat bath'},{id:'i1744',name:'Designer mat'},
    {id:'i1745',name:'Cloth drying rope'},{id:'i1746',name:'Trimmer'},{id:'i1747',name:'Ciprofloxacin'},
    {id:'i1748',name:'Sporolac'},{id:'i1749',name:'Hairspray bottle'},{id:'i1750',name:'Tea mugs'},
    {id:'i1751',name:'Water'}]}
];

const DEF_SETTINGS = {theme:'system',accent:'#4285F4',font:"'Poppins',sans-serif",fontSize:16,dl:'text'};
const DEF_QUANTITIES = [
  {id:'dq0',name:'Units'},
  {id:'dq1',name:'Kg'},
  {id:'dq2',name:'g'},
  {id:'dq3',name:'L'},
  {id:'dq4',name:'mL'},
  {id:'dq5',name:'Packets'}
];
