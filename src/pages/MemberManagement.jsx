import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Users, Edit3, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

// Sample member data
const sampleMembers = [
  {
    id: 'M001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    memberType: 'paid',
    joinedDate: '2024-01-15',
    validThrough: '2024-12-31',
  },
  {
    id: 'M002', 
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    memberType: 'temporary',
    joinedDate: '2024-03-20',
    validThrough: '2024-06-20',
  },
  {
    id: 'M003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com', 
    memberType: 'paid',
    joinedDate: '2024-02-10',
    validThrough: '2025-02-10',
  },
  {
    id: 'M004',
    name: 'Alice Wilson',
    email: 'alice.wilson@example.com',
    memberType: 'temporary',
    joinedDate: '2024-04-01',
    validThrough: '2024-07-01',
  },
  {
    id: 'M005',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    memberType: 'paid',
    joinedDate: '2024-01-30',
    validThrough: '2025-01-30',
  },
];

const MemberManagement = () => {
  const [members, setMembers] = useState(sampleMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingCell, setEditingCell] = useState(null); // { memberId: string, field: string }
  const [editValue, setEditValue] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set()); // 追踪展开的卡片

  // Check if member is expired
  const isExpired = (validThrough) => {
    const today = new Date();
    const expiryDate = new Date(validThrough);
    return expiryDate < today;
  };

  // Check if member is expiring soon (within 30 days)
  const isExpiringSoon = (validThrough) => {
    const today = new Date();
    const expiryDate = new Date(validThrough);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  // Filter and search logic
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterType === 'all') {
      matchesFilter = true;
    } else if (filterType === 'paid' || filterType === 'temporary') {
      matchesFilter = member.memberType === filterType;
    } else if (filterType === 'active') {
      matchesFilter = !isExpired(member.validThrough);
    } else if (filterType === 'expired') {
      matchesFilter = isExpired(member.validThrough);
    }
    
    return matchesSearch && matchesFilter;
  });

  // Get member type display text and styling
  const getMemberTypeDisplay = (type) => {
    switch (type) {
      case 'paid':
        return { text: 'Paid Member', variant: 'default' };
      case 'temporary':
        return { text: 'Temporary Member', variant: 'secondary' };
      default:
        return { text: 'Unknown', variant: 'outline' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Toggle card expansion
  const toggleCardExpansion = (memberId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedCards(newExpanded);
  };

  // Start editing a cell
  const startEditing = (memberId, field, currentValue) => {
    setEditingCell({ memberId, field });
    setEditValue(field === 'validThrough' ? formatDateForInput(currentValue) : currentValue);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Save edited value
  const saveEdit = () => {
    if (!editingCell) return;

    const { memberId, field } = editingCell;
    
    // Validation
    if (field === 'email' && !editValue.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (field === 'name' && editValue.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    if (field === 'validThrough') {
      const selectedDate = new Date(editValue);
      const today = new Date();
      if (selectedDate < today) {
        toast.error('Valid through date cannot be in the past');
        return;
      }
    }

    // Update member data
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId 
          ? { ...member, [field]: editValue }
          : member
      )
    );

    const fieldNames = {
      'name': 'Name',
      'email': 'Email',
      'validThrough': 'Valid Through'
    };

    toast.success(`${fieldNames[field]} updated successfully`);
    cancelEditing();
  };

  // Handle key press in edit input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Render editable cell for mobile cards
  const renderEditableCellMobile = (member, field, value, displayValue = value) => {
    const isEditing = editingCell?.memberId === member.id && editingCell?.field === field;
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-2 mt-2">
          <Input
            type={field === 'validThrough' ? 'date' : field === 'email' ? 'email' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="h-11 text-base flex-1"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
            onClick={saveEdit}
          >
            <Check className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
            onClick={cancelEditing}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      );
    }

    return (
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-muted/30 rounded-md px-3 py-3 group transition-colors min-h-[48px]"
        onClick={() => startEditing(member.id, field, value)}
      >
        <span className="flex-1 text-base">{displayValue}</span>
        <Edit3 className="h-5 w-5 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
      </div>
    );
  };

  // Render editable cell for desktop table
  const renderEditableCell = (member, field, value, displayValue = value) => {
    const isEditing = editingCell?.memberId === member.id && editingCell?.field === field;
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-2 min-h-[48px]">
          <Input
            type={field === 'validThrough' ? 'date' : field === 'email' ? 'email' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="h-9 text-sm flex-1"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
            onClick={saveEdit}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
            onClick={cancelEditing}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div 
        className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 rounded-md px-3 py-2 group min-h-[48px] transition-colors"
        onClick={() => startEditing(member.id, field, value)}
      >
        <span className="flex-1 text-sm">{displayValue}</span>
        <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
      </div>
    );
  };

  // Mobile card component
  const MemberCard = ({ member }) => {
    const memberTypeDisplay = getMemberTypeDisplay(member.memberType);
    const expiringSoon = isExpiringSoon(member.validThrough);
    const expired = isExpired(member.validThrough);
    const isExpanded = expandedCards.has(member.id);
    
    return (
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
        <CardContent className={`${isExpanded ? 'p-4' : 'p-3'}`}>
          {/* 基本信息行 */}
          <div className={`flex items-center justify-between ${isExpanded ? 'mb-3' : 'mb-2'}`}>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-1.5">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className={`font-semibold ${isExpanded ? 'text-lg' : 'text-base'}`}>{member.name}</h3>
                <div className="flex items-center gap-2">
                  {/* <p className="text-xs text-muted-foreground">{member.id}</p> */}
                    <>
                      <Badge variant={memberTypeDisplay.variant} className="px-2 py-0.5 text-xs">
                        {memberTypeDisplay.text}
                      </Badge>
                      {expired ? (
                        <Badge variant="destructive" className="px-2 py-0.5 text-xs">Expired</Badge>
                      ) : expiringSoon ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-600 px-2 py-0.5 text-xs">
                          Expiring Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600 px-2 py-0.5 text-xs">
                          Active
                        </Badge>
                      )}
                    </>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCardExpansion(member.id)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* 展开的详细信息 */}
          {isExpanded && (
            <div className="space-y-0 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                {renderEditableCellMobile(member, 'email', member.email)}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
                <div className="px-3 py-3 text-base">
                  {formatDate(member.joinedDate)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Valid Through</label>
                {renderEditableCellMobile(member, 'validThrough', member.validThrough, formatDate(member.validThrough))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* 背景装饰模式 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.08)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div className="relative p-4 md:p-6 lg:p-10 xl:p-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  <CardTitle className="text-2xl sm:text-3xl font-bold">Member Management</CardTitle>
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">
                  Total {filteredMembers.length} members
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 搜索和筛选区域 - 移动端优化 */}
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search member name, email or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="flex-1 sm:flex-none sm:w-[200px] h-12">
                      <SelectValue placeholder="Member Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="paid">Paid Members</SelectItem>
                      <SelectItem value="temporary">Temporary Members</SelectItem>
                      <SelectItem value="active">Active Members</SelectItem>
                      <SelectItem value="expired">Expired Members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 桌面端表格视图 */}
              <div className="hidden lg:block border rounded-xl shadow-lg overflow-hidden bg-white/60 backdrop-blur-sm">
                <Table>
                  <TableHeader className="bg-blue-50/60">
                    <TableRow>
                      <TableHead className="py-4 px-6 font-semibold">Member ID</TableHead>
                      <TableHead className="py-4 px-6 font-semibold">Name</TableHead>
                      <TableHead className="py-4 px-6 font-semibold">Member Type</TableHead>
                      <TableHead className="py-4 px-6 font-semibold">Joined Date</TableHead>
                      <TableHead className="py-4 px-6 font-semibold">Valid Through</TableHead>
                      <TableHead className="py-4 px-6 font-semibold">Status</TableHead>
                      <TableHead className="py-4 px-6 font-semibold">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => {
                      const memberTypeDisplay = getMemberTypeDisplay(member.memberType);
                      const expiringSoon = isExpiringSoon(member.validThrough);
                      const expired = isExpired(member.validThrough);
                      
                      return (
                        <TableRow key={member.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell className="font-medium py-5 px-6">{member.id}</TableCell>
                          <TableCell className="py-5 px-6">
                            {renderEditableCell(member, 'name', member.name)}
                          </TableCell>
                          <TableCell className="py-5 px-6">
                            <Badge variant={memberTypeDisplay.variant} className="px-3 py-1">
                              {memberTypeDisplay.text}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-5 px-6">{formatDate(member.joinedDate)}</TableCell>
                          <TableCell className="py-5 px-6">
                            {renderEditableCell(member, 'validThrough', member.validThrough, formatDate(member.validThrough))}
                          </TableCell>
                          <TableCell className="py-5 px-6">
                            {expired ? (
                              <Badge variant="destructive" className="px-3 py-1">Expired</Badge>
                            ) : expiringSoon ? (
                              <Badge variant="outline" className="text-orange-600 border-orange-600 px-3 py-1">
                                Expiring Soon
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600 border-green-600 px-3 py-1">
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-5 px-6">
                            {renderEditableCell(member, 'email', member.email)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* 移动端卡片视图 */}
              <div className="lg:hidden space-y-3">
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>

              {/* 无数据状态 */}
              {filteredMembers.length === 0 && (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <p className="text-xl font-medium text-muted-foreground mb-2">No matching members found</p>
                  <p className="text-base text-muted-foreground">Try adjusting your search criteria or filters</p>
                </div>
              )}

              {/* 帮助文本 */}
              <div className="mt-8 p-4 bg-blue-50/60 rounded-lg border-l-4 border-primary backdrop-blur-sm">
                <p className="text-sm text-muted-foreground">
                  💡 Click on Name, Email, or Valid Through fields to edit them directly.{' '}
                  <span className="lg:hidden">On mobile devices, tap the expand button to view more details.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement; 