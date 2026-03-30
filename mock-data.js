const servicesData = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    category: 'Specialty Care',
    description: 'Expert care for your heart. We diagnose and treat a wide range of cardiovascular conditions, from hypertension to heart failure.',
    imageUrl: 'images/56c6326956fc28e028e0fd37fbbd9c1b.jpg',
    alt: 'Cardiologist examining a patient'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    category: 'Primary Care',
    description: 'Compassionate and comprehensive healthcare for infants, children, and adolescents to ensure a healthy start in life.',
    imageUrl: 'images/06338c5618390aa8daa78da139a092a7.jpg',
    alt: 'Pediatrician with a child patient'
  },
  {
    id: 'diagnostic-imaging',
    name: 'Diagnostic Imaging',
    category: 'Diagnostics & Testing',
    description: 'Utilizing state-of-the-art technology like MRI, CT scans, and X-rays to provide clear and accurate diagnoses.',
    imageUrl: 'images/3a0019f539c1f8162ee0cd42ad604376.jpg',
    alt: 'Technician operating MRI machine'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    category: 'Specialty Care',
    description: 'Comprehensive care for bone, joint, and muscle conditions, including fractures, arthritis, and sports injuries.',
    imageUrl: 'images/52656c70c2f2146d06572924262a60c7.jpg',
    alt: 'Orthopedic doctor examining a knee'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    category: 'Specialty Care',
    description: 'Diagnosis and treatment of skin, hair, and nail conditions, from acne to eczema and skin cancer screenings.',
    imageUrl: 'images/56d35f4ebc97267429b84937fe7794a1.jpg',
    alt: 'Dermatologist inspecting skin'
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    category: 'Primary Care',
    description: 'Routine check-ups, preventive care, and management of common illnesses for adults and seniors.',
    imageUrl: 'images/0ed625d083b9293a2e4832441059d0e8.jpg',
    alt: 'General practitioner with patient'
  },
  {
    id: 'obgyn',
    name: 'Obstetrics & Gynecology',
    category: 'Specialty Care',
    description: 'Women’s health services including prenatal care, gynecological exams, and reproductive health counseling.',
    imageUrl: 'images/7389f2fe78f0bc482b83ab86c8613310.jpg',
    alt: 'OBGYN doctor with expectant mother'
  },
  {
    id: 'surgery',
    name: 'Surgical Services',
    category: 'Surgical Services',
    description: 'A full range of surgical procedures performed by experienced surgeons in state-of-the-art operating rooms.',
    imageUrl: 'images/ad3f315aa94465a2b5d4de6b5418eade.jpg',
    alt: 'Surgeon in operating room'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    category: 'Specialty Care',
    description: 'Diagnosis and treatment of brain, spine, and nervous system disorders, including stroke and epilepsy.',
    imageUrl: 'images/52656c70c2f2146d06572924262a60c7.jpg',
    alt: 'Neurologist reviewing brain scan'
  },
  {
    id: 'oncology',
    name: 'Oncology',
    category: 'Specialty Care',
    description: 'Comprehensive cancer care, including chemotherapy, radiation, and support services for patients and families.',
    imageUrl: 'images/cef345b32a8c0825c8c0cf947ac5ba19.jpg',
    alt: 'Oncologist consulting with patient'
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    category: 'Specialty Care',
    description: 'Care for digestive system disorders, including endoscopy, colonoscopy, and nutritional counseling.',
    imageUrl: 'images/2f1552874be63215dd85d9d54dad26dc.jpg',
    alt: 'Gastroenterologist performing endoscopy'
  },
  {
    id: 'urology',
    name: 'Urology',
    category: 'Specialty Care',
    description: 'Diagnosis and treatment of urinary tract and male reproductive system conditions.',
    imageUrl: 'images/047c9431d661625f3e084a087d3e98fb.jpg',
    alt: 'Urologist consulting with patient'
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    category: 'Specialty Care',
    description: 'Expert care for lung and respiratory conditions, including asthma, COPD, and sleep disorders.',
    imageUrl: 'images/56c6326956fc28e028e0fd37fbbd9c1b.jpg',
    alt: 'Pulmonologist with lung model'
  },
  {
    id: 'endocrinology',
    name: 'Endocrinology',
    category: 'Specialty Care',
    description: 'Management of hormone-related disorders such as diabetes, thyroid disease, and metabolic conditions.',
    imageUrl: 'images/2f1552874be63215dd85d9d54dad26dc.jpg',
    alt: 'Endocrinologist consulting patient'
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    category: 'Primary Care',
    description: 'Counseling, therapy, and psychiatric care for emotional and mental well-being.',
    imageUrl: 'images/92714ac970ba0f30f3feed3a692b0081.jpg',
    alt: 'Therapist with patient'
  },
  {
    id: 'physical-therapy',
    name: 'Physical Therapy',
    category: 'Diagnostics & Testing',
    description: 'Rehabilitation and recovery services for injuries, surgeries, and chronic pain.',
    imageUrl: 'images/d5a1dbf003f02970ef0ac6b45b40191d.jpg',
    alt: 'Physical therapist assisting patient'
  },
  {
    id: 'lab-testing',
    name: 'Lab Testing',
    category: 'Diagnostics & Testing',
    description: 'Comprehensive laboratory services for blood work, urinalysis, and other diagnostic tests.',
    imageUrl: 'images/3a0019f539c1f8162ee0cd42ad604376.jpg',
    alt: 'Lab technician analyzing samples'
  }
];

const patientsData = [
  { id: 'p1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', age: 45, gender: 'Male', lastVisit: '2024-03-15', condition: 'Hypertension', status: 'Stable' },
  { id: 'p2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901', age: 32, gender: 'Female', lastVisit: '2024-03-20', condition: 'Type 2 Diabetes', status: 'Managing' },
  { id: 'p3', name: 'Robert Brown', email: 'robert.brown@example.com', phone: '345-678-9012', age: 58, gender: 'Male', lastVisit: '2024-02-28', condition: 'Post-Surgery Recovery', status: 'Improving' },
  { id: 'p4', name: 'Emily Davis', email: 'emily.davis@example.com', phone: '456-789-0123', age: 27, gender: 'Female', lastVisit: '2024-03-10', condition: 'Asthma', status: 'Stable' },
  { id: 'p5', name: 'Michael Wilson', email: 'michael.wilson@example.com', phone: '567-890-1234', age: 50, gender: 'Male', lastVisit: '2024-03-25', condition: 'Back Pain', status: 'Acute' }
];

const allAppointmentsData = [
  { id: 'a1', patientId: 'p1', patientName: 'John Doe', doctor: 'Dr. Sarah Johnson', date: '2026-03-30', time: '10:00 AM', type: 'Virtual', status: 'Confirmed' },
  { id: 'a2', patientId: 'p2', patientName: 'Jane Smith', doctor: 'Dr. Michael Chen', date: '2026-03-30', time: '11:30 AM', type: 'In-Person', status: 'Arrived' },
  { id: 'a3', patientId: 'p3', patientName: 'Robert Brown', doctor: 'Dr. Sarah Johnson', date: '2026-03-30', time: '02:00 PM', type: 'Virtual', status: 'Pending' },
  { id: 'a4', patientId: 'p4', patientName: 'Emily Davis', doctor: 'Dr. Emily White', date: '2026-03-31', time: '09:00 AM', type: 'In-Person', status: 'Confirmed' }
];

const messagesData = [
  {
    id: 'm1',
    patientId: 'p1',
    patientName: 'John Doe',
    thread: [
      { sender: 'doctor', message: 'Hello John, your lab results look good. Keep up the healthy diet.', timestamp: '2026-03-28 10:00 AM' },
      { sender: 'patient', message: 'Thank you, Dr. Johnson. I have been following the plan.', timestamp: '2026-03-28 11:30 AM' }
    ]
  },
  {
    id: 'm2',
    patientId: 'p2',
    patientName: 'Jane Smith',
    thread: [
      { sender: 'patient', message: 'I am experiencing some dizziness after taking the new medication.', timestamp: '2026-03-29 02:00 PM' },
      { sender: 'doctor', message: 'Please stop the medication immediately and come in for a checkup tomorrow.', timestamp: '2026-03-29 02:15 PM' }
    ]
  }
];
