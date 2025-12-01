import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import StudentStatsCards from '../../components/admin/StudentStatsCards';
import StudentTable from '../../components/admin/StudentTable';
import Pagination from '../../components/admin/Pagination';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Students');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  // Mock data - replace with actual API call
  const mockStudents = [
    {
      id: 'cb4def35-ab35-4a09-9955-d6ea8f63a704',
      name: 'Test',
      email: 'jky42rtfhy@llubd.com',
      phone: '6282726368',
      status: 'Active',
      verification: 'Verified'
    },
    {
      id: 'cb4dd68b-bc68-4bfe-adbd-cbe26e96c44e',
      name: 'Test',
      email: 'aviragp@gmail.com',
      phone: '6282726368',
      status: 'Active',
      verification: 'Pending'
    },
    {
      id: 'cb8d43ce-9e82-4a14-af3e-f766f2f8e87',
      name: 'Test',
      email: 'aviragp2@gmail.com',
      phone: '6282726368',
      status: 'Active',
      verification: 'Pending'
    },
    {
      id: 'f0036433-4be7-4b8d-8d29-17e43e62554',
      name: 'Yadhu',
      email: 'krishnany357@gmail.com',
      phone: '6282665643',
      status: 'Active',
      verification: 'Verified'
    },
    {
      id: 'fdd14c2-43db-4f01-a45a-3fb4df99f59f',
      name: 'tute',
      email: 'engthajiuzu1@jcitypc.com',
      phone: '4234567895',
      status: 'Active',
      verification: 'Verified'
    }
  ];

  // Stats calculation
  const stats = {
    total: students.length,
    listed: students.filter(s => s.status === 'Active').length,
    unlisted: students.filter(s => s.status !== 'Active').length
  };

  // Load students data
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
      } catch (error) {
        console.error('Failed to load students:', error);
        toast.error('Failed to load students data');
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = students;

    // Apply status filter
    if (filterStatus !== 'All Students') {
      filtered = filtered.filter(student => student.status === filterStatus);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [students, filterStatus, searchTerm]);

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setFilterStatus('All Students');
    setCurrentPage(1);
    // Reload data
    window.location.reload();
  };

  const handleBlockStudent = async (studentId) => {
    try {
      // Simulate API call to block student
      console.log('Blocking student:', studentId);
      toast.success('Student blocked successfully');
      
      // Update local state
      setStudents(prev => 
        prev.map(student => 
          student.id === studentId 
            ? { ...student, status: 'Blocked' }
            : student
        )
      );
    } catch (error) {
      console.error('Failed to block student:', error);
      toast.error('Failed to block student');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <PageLoader text="Loading Students..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Students</h1>
            <p className="text-gray-600">Manage all registered students</p>
          </div>

          {/* Stats Cards */}
          <StudentStatsCards stats={stats} />

          {/* Controls Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Left side - Title and Filter */}
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Student List</h2>
                <select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="All Students">All Students</option>
                  <option value="Active">Active Students</option>
                  <option value="Blocked">Blocked Students</option>
                </select>
              </div>

              {/* Right side - Search and Refresh */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 w-64"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button
                  onClick={handleRefresh}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <StudentTable
            students={currentStudents}
            onBlockStudent={handleBlockStudent}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            itemsPerPage={studentsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <AdminFooter />
    </div>
  );
};

export default ManageStudents;